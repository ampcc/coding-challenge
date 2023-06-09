import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { BackendService } from 'src/app/core/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NgFor, NgIf, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Challenge } from '../../models/challenge';
import { Application } from '../../models/application';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
  ],
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AdminApplicationsComponent {
  private adminToken: string | null;

  public hideContentActiveApplications = false;
  public hideContentArchivedApplications = true;

  public hideFilterSelect = true;

  public challengeArray: Challenge[] = [];
  private challengeFilter: number[] = [];
  private statusFilter: string[] = [];
  public applicationsArray: Application[] = [];
  public filteredApplicationsArray: Application[] = [];
  public archivedArray: Application[] = [];
  public filteredArchivedArray: Application[] = [];

  public searchContent = "";

  public resultOfLinting = "";

  public newChallengesArray: [{
    id?: number,
    heading: string
  }?] = [];

  public hideSubmissionDate = false;
  public hideTimeLimit = false;

  @ViewChild('filterButton') filterButton?: ElementRef;
  @ViewChild('filterSelect') filterSelect?: ElementRef;

  public constructor(private backend: BackendService, public dialog: MatDialog, public router: Router, private renderer: Renderer2) {
    this.adminToken = null;

    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.hideFilterSelect && this.filterButton && e.target !== this.filterButton.nativeElement && !this.filterButton.nativeElement.contains(e.target) && this.filterSelect && e.target !== this.filterSelect.nativeElement && !this.filterSelect.nativeElement.contains(e.target)) {
        this.showFilter();
      }
    });
  }

  public ngOnInit(): void {
    // Check if Admin Token is available
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    if (this.adminToken === null) {
      this.router.navigateByUrl("/admin_login")
    } else {
      // get all Applications
      this.backend.getApplications(this.adminToken).subscribe((response) => {
        //if successful receive all Applications and split them into Archived and Active
        response.forEach((element: Application) => {
          if (element.status <= 3) {
            this.applicationsArray.push(element);
          } else if (element.status === 5) {
            this.archivedArray.push(element);
          }
        });
        //only filtered Arrays are displayed
        this.filteredApplicationsArray = this.applicationsArray;
        this.filteredArchivedArray = this.archivedArray;
      });
      // get all Challenges
      this.backend.getChallenges(this.adminToken)
        .subscribe((data: Challenge[]) => {
          this.challengeArray = data;
        });
    }
  }

  /**
   * Changes the tab and shows the associated content.
   * This also includes dynamically setting the style of the tabs
   * @param id The id tab-html element
   */
  public changeTab(id: string): void {
    const elementActiveChallenge = <HTMLLabelElement>document.getElementById('tabActiveApplications');
    const elementArchive = <HTMLLabelElement>document.getElementById('tabArchivedApplications');

    switch (id) {
      case 'tabActiveApplications':
        this.hideContentActiveApplications = false;
        this.hideContentArchivedApplications = true;

        elementActiveChallenge.setAttribute("style", "border-bottom: 2px solid black;");
        elementArchive.setAttribute("style", "border-bottom: none;");
        break;
      case 'tabArchivedApplications':
        this.hideContentArchivedApplications = false;
        this.hideContentActiveApplications = true;

        elementActiveChallenge.setAttribute("style", "border-bottom: none;");
        elementArchive.setAttribute("style", "border-bottom: 2px solid black;");
        break;
    }
  }

  /**
   * Searches for an application by the applicationId.
   * The applicationId is specified by the user via an input element
   */
  public search(): void {
    this.searchContent = (<HTMLInputElement>document.getElementById("inputSearchBar")).value;
    this.searchContent = this.searchContent.trim();
    this.updateFilteredApplicantArray();
    this.updateFilteredArchiveArray();
  }

  /**
   * Toggles the visibility of the filter content
   */
  public showFilter(): void {
    this.hideFilterSelect = !this.hideFilterSelect;
  }

  /**
   * Unfolds the desired subtree and its input options.
   * Which subtree is to be unfolded is defined by a click of the user
   * @param id The id of the subtree-html element
   */
  public toggleTreeView(id: string): void {
    const element = document.getElementById(id);
    if (element !== null && element !== undefined) {
      const parentElement = element.parentElement;

      if (parentElement !== null && parentElement !== undefined) {
        parentElement.querySelector(".nested")!.classList.toggle("active");
        element.classList.toggle("caret-down");
      }
    }
  }

  /**
   * Filters/updates the archived applications by the applicationId and other parameters set by the filter.
   * The applicationId is specified in the searchContent attribute
   */
  private updateFilteredArchiveArray(): void {
    if (this.challengeFilter.length === 0) {
      this.filteredArchivedArray = this.archivedArray;
    } else {
      this.filteredArchivedArray = [];
      this.archivedArray.forEach((app) => {
        if (this.challengeFilter.some(e => e === app.challengeId)) {
          this.filteredArchivedArray.push(app);
        }
      });
    }

    if (this.searchContent !== "" && this.searchContent !== null && this.searchContent !== undefined) {
      this.filteredArchivedArray = this.filteredArchivedArray.filter(element => element.applicationId === this.searchContent);
    }
  }

  /**
   * Filters/updates the applications by the applicationId and other parameters set by the filter.
   * The applicationId is specified in the searchContent attribute of the class
   */
  private updateFilteredApplicantArray(): void {
    if (this.challengeFilter.length === 0 && this.statusFilter.length === 0) {
      this.filteredApplicationsArray = this.applicationsArray;
      this.filteredArchivedArray = this.archivedArray;
    } else if (this.challengeFilter.length !== 0 && this.statusFilter.length === 0) {
      this.filteredApplicationsArray = [];
      this.applicationsArray.forEach((app) => {
        if (this.challengeFilter.some(e => e === app.challengeId)) {
          this.filteredApplicationsArray.push(app);
        }
      });
    } else if (this.challengeFilter.length === 0 && this.statusFilter.length !== 0) {
      this.filteredApplicationsArray = [];
      this.applicationsArray.forEach((app) => {
        const statusText = this.getStatusText(app.status).replaceAll(" ", "_");
        if (this.statusFilter.some(e => e === statusText)) {
          this.filteredApplicationsArray.push(app);
        }
      });
    } else {
      this.filteredApplicationsArray = [];
      this.applicationsArray.forEach((app) => {
        if (this.challengeFilter.some(e => e === app.challengeId)) {
          const statusText = this.getStatusText(app.status).replaceAll(" ", "_");
          if (this.statusFilter.some(e => e === statusText)) {
            this.filteredApplicationsArray.push(app);
          }
        }
      });
    }

    if (this.searchContent !== "" && this.searchContent !== null && this.searchContent !== undefined) {
      this.filteredApplicationsArray = this.filteredApplicationsArray.filter(element => element.applicationId === this.searchContent);
    }
  }

  /**
   * Stores the filter option for a desired challenge and updates the applications and archived aplications
   * @param values The html element the user clicked on. The information for the filter is contained inside the elements id.
   */
  public checkboxChallengeChange(values: any): void {
    const challId: number = +values.currentTarget.id.substring(9);
    if (this.challengeFilter.some(e => e === challId)) {
      this.challengeFilter.splice(this.challengeFilter.findIndex(e => e === challId), 1);
    } else {
      this.challengeFilter.push(challId);
    }
    this.updateFilteredApplicantArray();
    this.updateFilteredArchiveArray();
  }

  /**
   * Stores the filter option for a desired status and updates the applications and archived aplications
   * @param values The html element the user clicked on. The information for the filter is contained inside the elements id.
   */
  public checkboxStatusChange(values: any): void {
    const status: string = values.currentTarget.id;
    if (this.statusFilter.some(e => e === status)) {
      this.statusFilter.splice(this.statusFilter.findIndex(e => e === status), 1);
    } else {
      this.statusFilter.push(status);
    }
    this.updateFilteredApplicantArray();
  }

  /**
   * Searches for the applications associated challenge and its heading
   * @param challengeId The id of the applications challenge
   * @returns The heading of the challenge as a string
   */
  public getChallengeHeading(challengeId: number): string {
    const elementHeading = this.challengeArray.find(element => element.id === challengeId)?.challengeHeading;

    if (elementHeading === undefined) {
      return 'Error: Challenge not found';
    }
    return elementHeading;
  }

  /**
   * Maps the applications status number to the corresponding text
   * @param status The status of the application as a number
   * @returns The status of the application as a string
   */
  public getStatusText(status: number): string {
    switch (status) {
      case 0:
        this.hideSubmissionDate = true;
        this.hideTimeLimit = false;
        return 'not uploaded yet';
      case 1:
        this.hideSubmissionDate = true;
        this.hideTimeLimit = false;
        return 'not uploaded yet';
      case 2:
        this.hideSubmissionDate = false;
        this.hideTimeLimit = true;
        return 'uploaded';
      case 3:
        this.hideSubmissionDate = false;
        this.hideTimeLimit = true;
        return 'uploaded';
      case 4:
        this.hideSubmissionDate = true;
        this.hideTimeLimit = false;
        return 'not submitted in time';
      case 5:
        this.hideSubmissionDate = false;
        this.hideTimeLimit = true;
        return 'archived';
      default:
        this.hideSubmissionDate = true;
        this.hideTimeLimit = true;
        return 'given status is unknown: ' + status;
    }

  }

  /**
   * Calcutes the remaining time of the application
   * @param app The application object
   * @returns The remaining time of the application as a string
   */
  public getTimeLimit(app: Application): string {
    return this.backend.calcRemainingTime(new Date().getTime(), app.expiry);
  }

  /**
   * Maps the applications submission date to a formated date
   * @param submissionDate The submission date of the application
   * @returns The submission date as a formatted text
   */
  public getSubmissionDateText(submissionDate: number): string {

    if (submissionDate === 0 || submissionDate === null || submissionDate === undefined) {
      return 'not uploaded in time';
    }
    return '' + formatDate(Math.floor(submissionDate * 1000), "dd.MM.yyyy HH:mm", "en-US");
  }

  /**
   * Opens a modal dialog that displays detailed information of the active application.
   * On top of that, buttons for additional functionality are also displayed
   * @param application The active application of which information has to be shown
   */
  public openDialogActiveApplications(application: Application): void {
    DialogComponent.name;
    this.backend.getResult(this.adminToken, application.applicationId).subscribe((response) => {
      // Formats linter results to display properly, similar to the way GitHub displays it
      if (response.content === undefined || response.content === null) {
        this.resultOfLinting = "Linter result can not be found. Please check the GitHub Repository or wait.";
      } else {
        const lengths = response.content.map((element: [string]) => element.length);
        const maxColumns = Math.max(...lengths);

        this.resultOfLinting = '<table>';
        let tableCell = '';
        response.content.forEach((element: [string]) => {
          console.log(maxColumns);
          if (element == response.content[0]) {
            tableCell = 'th';
          } else {
            tableCell = 'td';
          }
          if (element.length == maxColumns) {
            this.resultOfLinting = this.resultOfLinting + '<tr>';
            element.forEach(value => {
              this.resultOfLinting = this.resultOfLinting + '<' + tableCell + '>' + value + '</' + tableCell + '>';
            });
            this.resultOfLinting = this.resultOfLinting + '</tr>';
          } else if (element.length > 0) {
            const colspan = Number(maxColumns / element.length);
            this.resultOfLinting = this.resultOfLinting + '<tr>';
            element.forEach(value => {
              this.resultOfLinting = this.resultOfLinting + '<' + tableCell + ' colspan="' + colspan + '">' + value + '</' + tableCell + '>';
            });
            this.resultOfLinting = this.resultOfLinting + '</tr>';
          }
        });
        this.resultOfLinting = this.resultOfLinting + '</table>';
      }
      this.displayDialogActiveApplications(application);
    }, (error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          window.sessionStorage.clear();
          this.router.navigateByUrl("/unauthorized");
          break;
        case 404:
          this.resultOfLinting = "Linter result can not be found. Please check the GitHub Repository or wait.";
          this.displayDialogActiveApplications(application);
          break;
        default:
          window.sessionStorage.clear();
          this.router.navigateByUrl("/internalError");
          break;
      }
    })
  }

  private displayDialogActiveApplications(application: Application): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Applicant ' + application.applicationId,
        description: {
          important: 'Programming Language: ' + application.programmingLanguage + '<br>Operating System: ' + application.operatingSystem + '<br><br> Linter-Result:',
          link: 'Open Project on GitHub',
          url: 'https://github.com/ampcc/' + application.githubRepo,
          details: "<div class='resultLinting'>" + this.resultOfLinting + "</div>"
        },
        buttons: {
          left: { title: 'Archive', look: 'primary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });

    // If the dialog is closed and the result is 1 (the user decided to archive an application), the backend tries to edit the application
    // If this action was successful the application immediately gets moved to archive
    // Otherwise the user gets navigated to an error page depending on the error code
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.backend.editApplication(this.adminToken, application.applicationId, 5)
          .subscribe((result) => {
            const index = this.applicationsArray.findIndex(app => app.applicationId === application.applicationId);
            this.applicationsArray.splice(index, 1);
            this.archivedArray.push(application);
          }, (error: HttpErrorResponse) => {
            switch (error.status) {
              case 401:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/unauthorized");
                break;
              case 404:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/notFound");
                break;
              default:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/internalError");
                break;
            }
          });
      }
    })
  }

  /**
   * Opens a modal dialog that enables the user to extend the time limit of an application or select a new challenge
   * @param application The application which is to be edited
   */
  public openExtendDialogActiveApplications(application: Application): void {
    DialogComponent.name;
    // Array of possible new challenges gets filled with all existing challenges except the one already assigned to the user
    this.newChallengesArray = [];
    for (let i = 0; i < this.challengeArray.length; i++) {
      if (this.challengeArray[i].id != application.challengeId && this.challengeArray[i].active) {
        this.newChallengesArray.push({
          id: this.challengeArray[i].id,
          heading: this.challengeArray[i].challengeHeading
        });
      }
    }

    // Opens dialog to let admin expand time limit or select new challenge
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Applicant ' + application.applicationId,
        description: {
          extend: true,
          challenges: this.newChallengesArray,
        },
        buttons: {
          left: { title: 'Commit Changes', look: 'primary' },
          middle: { title: 'Archive', look: 'secondary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });

    // If the dialog was closed with result 1 (the user commited changes), the backend tries to edit the application accordingly and immediately updates the list
    // If an error occurrs, the user gets redireced to one of the error pages
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.s && result.s == 1) {
        this.backend.editApplication(this.adminToken, application.applicationId, application.status, result.c, result.e)
          .subscribe((result) => {
            // Update the list of applications
            const index = this.applicationsArray.findIndex(app => app.applicationId === application.applicationId);
            this.backend.getApplication(this.adminToken, application.applicationId).subscribe((response) => {
              this.applicationsArray.splice(index, 0, response);
              this.applicationsArray.splice(index + 1, 1);
            });
          }, (error: HttpErrorResponse) => {
            switch (error.status) {
              case 401:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/unauthorized");
                break;
              case 404:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/notFound");
                break;
              default:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/internalError");
                break;
            }
          });
      }

      // If the dialog was closed with result 2 (the user archived an application), the backend archives the application accordingly and updates the list
      // If an error occurrs, the user gets redireced to one of the error pages
      if (result == 2) {
        this.backend.editApplication(this.adminToken, application.applicationId, 5)
          .subscribe((result) => {
            const index = this.applicationsArray.findIndex(app => app.applicationId === application.applicationId);
            this.applicationsArray.splice(index, 1);
            this.archivedArray.push(application);
          }, (error: HttpErrorResponse) => {
            switch (error.status) {
              case 401:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/unauthorized");
                break;
              case 404:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/notFound");
                break;
              default:
                window.sessionStorage.clear();
                this.router.navigateByUrl("/internalError");
                break;
            }
          });
      }
    })
  }

  /**
   * Opens a modal dialog that displays detailed information of the archived application.
   * On top of that, buttons for additional functionality are also displayed
   * @param application The archived application of which information has to be shown
   */
  public openDialogArchivedApplications(application: Application): void {
    DialogComponent.name;
    this.backend.getResult(this.adminToken, application.applicationId).subscribe((response) => {
      // Formats linter results to display properly
      if (response.content === undefined || response.content === null) {
        this.resultOfLinting = "Linter result can not be found. Please check the GitHub Repository or wait.";
      } else {
        const lengths = response.content.map((element: [string]) => element.length);
        const maxColumns = Math.max(...lengths);

        this.resultOfLinting = '<table>';
        let tableCell = '';
        response.content.forEach((element: [string]) => {
          console.log(maxColumns);
          if (element == response.content[0]) {
            tableCell = 'th';
          } else {
            tableCell = 'td';
          }
          if (element.length == maxColumns) {
            this.resultOfLinting = this.resultOfLinting + '<tr>';
            element.forEach(value => {
              this.resultOfLinting = this.resultOfLinting + '<' + tableCell + '>' + value + '</' + tableCell + '>';
            });
            this.resultOfLinting = this.resultOfLinting + '</tr>';
          } else if (element.length > 0) {
            const colspan = Number(maxColumns / element.length);
            this.resultOfLinting = this.resultOfLinting + '<tr>';
            element.forEach(value => {
              this.resultOfLinting = this.resultOfLinting + '<' + tableCell + ' colspan="' + colspan + '">' + value + '</' + tableCell + '>';
            });
            this.resultOfLinting = this.resultOfLinting + '</tr>';
          }
        });
        this.resultOfLinting = this.resultOfLinting + '</table>';
      }
      this.displayDialogArchivedApplications(application);
    }, (error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          window.sessionStorage.clear();
          this.router.navigateByUrl("/unauthorized");
          break;
        case 404:
          this.resultOfLinting = "Linter result can not be found. Please check the GitHub Repository or wait.";
          this.displayDialogArchivedApplications(application);
          break;
        default:
          window.sessionStorage.clear();
          this.router.navigateByUrl("/internalError");
          break;
      }
    });
  }

  private displayDialogArchivedApplications(application: Application): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Applicant ' + application.applicationId,
        description: {
          important: 'Programming Language: ' + application.programmingLanguage + '<br>Operating System: ' + application.operatingSystem + '<br><br> Linter-Result:',
          link: 'Open Project on GitHub',
          url: 'https://github.com/ampcc/' + application.githubRepo,
          details: "<div class='resultLinting'>" + this.resultOfLinting + "</div>"
        },
        buttons: {
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });
  }

}
