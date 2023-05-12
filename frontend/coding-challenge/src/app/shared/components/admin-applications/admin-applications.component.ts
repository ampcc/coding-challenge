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
  challenge: Challenge;
  applicant: Application;
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
  public resultOfLinting: String = "";

  public newChallengesArray: [{
    id?: number,
    heading: string
  }?] = [];

  public hideSubmissionDate: boolean = false;
  public hideTimeLimit: boolean = false;



  public constructor(private backend: BackendService, public dialog: MatDialog, public router: Router) {
    this.challenge = { id: 0, challengeHeading: '', challengeText: '' };
    this.adminToken = null;
    this.applicant = { applicationId: "", applicationKey: "", challengeId: 0, expiry: 0, githubRepo: "", operatingSystem: "", programmingLanguage: "", status: 0, submission: 0, passphrase: "a4Xz!5T%" };
  }


  public ngOnInit(): void {
    // Check if Admin Token is available
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    if (this.adminToken === null) {
      this.router.navigateByUrl("/admin_login")
    } else {
      this.backend.getApplications(this.adminToken).subscribe((response) => {
        response.forEach((element: Application) => {
          if (element.status <= 3) {
            this.applicantsArray.push(element);
          } else if (element.status === 5) {
            this.archivArray.push(element);
          }
        });
        this.filteredApplicantsArray = this.applicantsArray;
        this.filteredArchivArray = this.archivArray;
      });
      const challengeInfos = this.backend.getChallenges(this.adminToken)
        .subscribe((data: Challenge[]) => {
          this.challengeArray = data;
        });
    }
  }

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

  public showFilter(): void {
    this.hideFilterSelect = !this.hideFilterSelect;
  }

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
  }

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
  }

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

  public checkboxStatusChange(values: any): void {
    const status: string = values.currentTarget.id;
    if (this.statusFilter.some(e => e === status)) {
      this.statusFilter.splice(this.statusFilter.findIndex(e => e === status), 1);
    } else {
      this.statusFilter.push(status);
    }
    this.updateFilteredApplicantArray();
  }

  public checkboxTimeLimitChange(): void {

  }

  public getChallengeHeading(challengeId: number): string {
    let elementHeading = this.challengeArray.find(element => element.id === challengeId)?.challengeHeading;

    if (elementHeading === undefined) {
      return 'Error: Challenge not found';
    }
    return elementHeading;
  }

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

  public getTimeLimit(app: Application): string {
    return this.backend.calcRemainingTime(new Date().getTime(), app.expiry);
  }

  public getSubmissionDateText(submissionDate: number): string {

    if (submissionDate === 0 || submissionDate === null || submissionDate === undefined) {
      return 'not uploaded in time';
    }
    return '' + formatDate(Math.floor(submissionDate * 1000), "dd.MM.yyyy HH:mm", "en-US");
  };


  public openDialogActiveChallenges(application: Application): void {
    DialogComponent.name;
    this.backend.getResult(this.adminToken, application.applicationId).subscribe((response) => {
      this.resultOfLinting = response.content;
      let dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Applicant ' + application.applicationId,
          description: {
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

  public openExtendDialogActiveChallenges(application: Application): void {
    // TODO: Check if dialog opens correctly displaying all possible challenges (except the one previously given) in dropdown
    DialogComponent.name;
    this.newChallengesArray = [];
    for (var i = 0; i < this.challengeArray.length; i++) {
      if (this.challengeArray[i].id != application.challengeId) {
        this.newChallengesArray.push({
          id: this.challengeArray[i].id,
          heading: this.challengeArray[i].challengeHeading
        });
      }
    }
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
    dialogRef.afterClosed().subscribe(result => {
      // TODO: Test if time limit gets successfully expanded
      if (result.s && result.s == 1) {
        //console.log(result.e)
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


  public openDialogArchiv(application: Application): void {
    DialogComponent.name;
    this.backend.getResult(this.adminToken, application.applicationId).subscribe((response) => {
      this.resultOfLinting = response.content;
      let dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Applicant ' + application.applicationId,
          description: {
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
