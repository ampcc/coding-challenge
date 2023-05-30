import { Component, ViewEncapsulation } from '@angular/core';
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

  public hideContentActiveChallenges: boolean = false;
  public hideContentArchiv: boolean = true;

  public hideFilterSelect: boolean = true;

  public challengeArray: Challenge[] = [];
  private challengeFilter: number[] = [];
  private statusFilter: string[] = [];
  public applicantsArray: Application[] = [];
  public filteredApplicantsArray: Application[] = [];
  public archivArray: Application[] = [];
  public filteredArchivArray: Application[] = [];

  public searchContent: String = "";

  public resultOfLinting: String = "";

  public newChallengesArray: [{
    id?: number,
    heading: string
  }?] = [];

  public hideSubmissionDate: boolean = false;
  public hideTimeLimit: boolean = false;



  public constructor(private backend: BackendService, public dialog: MatDialog, public router: Router) {
    this.adminToken = null;
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
            this.applicantsArray.push(element);
          } else if (element.status === 5) {
            this.archivArray.push(element);
          }
        });
        //only filtered Arrays are displayed
        this.filteredApplicantsArray = this.applicantsArray;
        this.filteredArchivArray = this.archivArray;
      });
      // get all Challenges
      const challengeInfos = this.backend.getChallenges(this.adminToken)
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
    let elementActiveChallenge = <HTMLLabelElement>document.getElementById('tab_active_challenges');
    let elementArchive = <HTMLLabelElement>document.getElementById('tab_archiv');

    switch (id) {
      case 'tab_active_challenges':
        this.hideContentActiveChallenges = false;
        this.hideContentArchiv = true;

        elementActiveChallenge.setAttribute("style", "border-bottom: 2px solid black;");
        elementArchive.setAttribute("style", "border-bottom: none;");
        break;
      case 'tab_archiv':
        this.hideContentArchiv = false;
        this.hideContentActiveChallenges = true;

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
    this.searchContent = (<HTMLInputElement>document.getElementById("input_search_bar")).value;
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
    let element = document.getElementById(id);
    if (element !== null && element !== undefined) {
      let parentElement = element.parentElement;

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
      this.filteredArchivArray = this.archivArray;
    } else {
      this.filteredArchivArray = [];
      this.archivArray.forEach((app) => {
        if (this.challengeFilter.some(e => e === app.challengeId)) {
          this.filteredArchivArray.push(app);
        }
      });
    }

    if (this.searchContent !== "" && this.searchContent !== null && this.searchContent !== undefined) {
      this.filteredArchivArray = this.filteredArchivArray.filter(element => element.applicationId === this.searchContent);
    }
  }

  /**
   * Filters/updates the applications by the applicationId and other parameters set by the filter.
   * The applicationId is specified in the searchContent attribute of the class
   */
  private updateFilteredApplicantArray(): void {
    if (this.challengeFilter.length === 0 && this.statusFilter.length === 0) {
      this.filteredApplicantsArray = this.applicantsArray;
      this.filteredArchivArray = this.archivArray;
    } else if (this.challengeFilter.length !== 0 && this.statusFilter.length === 0) {
      this.filteredApplicantsArray = [];
      this.applicantsArray.forEach((app) => {
        if (this.challengeFilter.some(e => e === app.challengeId)) {
          this.filteredApplicantsArray.push(app);
        }
      });
    } else if (this.challengeFilter.length === 0 && this.statusFilter.length !== 0) {
      this.filteredApplicantsArray = [];
      this.applicantsArray.forEach((app) => {
        const statusText = this.getStatusText(app.status).replaceAll(" ", "_");
        if (this.statusFilter.some(e => e === statusText)) {
          this.filteredApplicantsArray.push(app);
        }
      });
    } else {
      this.filteredApplicantsArray = [];
      this.applicantsArray.forEach((app) => {
        if (this.challengeFilter.some(e => e === app.challengeId)) {
          const statusText = this.getStatusText(app.status).replaceAll(" ", "_");
          if (this.statusFilter.some(e => e === statusText)) {
            this.filteredApplicantsArray.push(app);
          }
        }
      });
    }

    if (this.searchContent !== "" && this.searchContent !== null && this.searchContent !== undefined) {
      this.filteredApplicantsArray = this.filteredApplicantsArray.filter(element => element.applicationId === this.searchContent);
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
    let elementHeading = this.challengeArray.find(element => element.id === challengeId)?.challengeHeading;

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
    console.log(application)
    this.backend.getResult(this.adminToken, application.applicationId).subscribe((response) => {
      // Formats linter results to display properly, similar to the way GitHub displays it
      this.resultOfLinting = response.content;
      JSON.stringify(this.resultOfLinting).replaceAll(new RegExp('\\\\n', 'g'), '<br>');
      this.resultOfLinting.replaceAll(new RegExp('\\\\"', 'g'), '');
      let dialogRef = this.dialog.open(DialogComponent, {
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
              var index = this.applicantsArray.findIndex(app => app.applicationId === application.applicationId);
              this.applicantsArray.splice(index, 1);
              this.archivArray.push(application);
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
    for (var i = 0; i < this.challengeArray.length; i++) {
      if (this.challengeArray[i].id != application.challengeId) {
        this.newChallengesArray.push({
          id: this.challengeArray[i].id,
          heading: this.challengeArray[i].challengeHeading
        });
      }
    }

    // Opens dialog to let admin expand time limit or select new challenge
    let dialogRef = this.dialog.open(DialogComponent, {
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
      if (result.s && result.s == 1) {
        this.backend.editApplication(this.adminToken, application.applicationId, application.status, result.c, result.e)
          .subscribe((result) => {
            // Update the list of applications
            var index = this.applicantsArray.findIndex(app => app.applicationId === application.applicationId);
            this.backend.getApplication(this.adminToken, application.applicationId).subscribe((response) => {
              this.applicantsArray.splice(index, 0, response);
              this.applicantsArray.splice(index + 1, 1);
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
            var index = this.applicantsArray.findIndex(app => app.applicationId === application.applicationId);
            this.applicantsArray.splice(index, 1);
            this.archivArray.push(application);
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
  };

  /**
   * Opens a modal dialog that displays detailed information of the archived application.
   * On top of that, buttons for additional functionality are also displayed
   * @param application The archived application of which information has to be shown
   */
  public openDialogArchivedApplications(application: Application): void {
    DialogComponent.name;
    this.backend.getResult(this.adminToken, application.applicationId).subscribe((response) => {
      // Formats linter results to display properly
      this.resultOfLinting = response.content;
      JSON.stringify(this.resultOfLinting).replaceAll(new RegExp('\\\\n', 'g'), '<br>');
      this.resultOfLinting.replaceAll(new RegExp('\\\\"', 'g'), '');
      let dialogRef = this.dialog.open(DialogComponent, {
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
    });
  }
}
