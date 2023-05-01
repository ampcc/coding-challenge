import { Component, ViewEncapsulation } from '@angular/core';
import {BackendService} from 'src/app/core/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {NgFor, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Challenge } from '../../models/challenge';
import { Application } from '../../models/application';

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

  public hideContentActiveChallenges: boolean = false;
  public hideContentArchiv: boolean = true;

  public hideFilterSelect: boolean = true;

  public challengeArray: Challenge[] = [{challengeId: 0, challengeHeading: 'Challenge0',challengeText: 'xxx'},
                                        {challengeId: 1, challengeHeading: 'Challenge1',challengeText: 'xxx'}
                                       ];
  public applicantsArray: Application[] = [{applicationId: "sdfs0", applicationKey:"", challengeId: 0 , expiryDate: 0, githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 0, submissionDate: 0, passphrase: "a4Xz!5T%"}, 
                                           {applicationId: "dgtertxc", applicationKey:"", challengeId: 1 , expiryDate: 0, githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 3, submissionDate: 23456, passphrase: "a4Xz!5T%"}
                                          ];
  public archivArray: Application[] = [{applicationId: "sdfs0", applicationKey:"", challengeId: 0 , expiryDate: 0, githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 0, submissionDate: 0, passphrase: "a4Xz!5T%"}, 
                                       {applicationId: "dgtertxc", applicationKey:"", challengeId: 1 , expiryDate: 0, githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 0, submissionDate: 234234, passphrase: "a4Xz!5T%"}
                                      ];

  public hideSubmissionDate: boolean = false;
  public hideTimeLimit: boolean = false;

 
 
  public constructor(private backend: BackendService, public dialog: MatDialog,) {
    this.challenge = {challengeId: 0, challengeHeading: '',challengeText: ''};
    this.applicant = {applicationId: "", applicationKey:"", challengeId: 0 , expiryDate: 0, githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 0, submissionDate: 0, passphrase: "a4Xz!5T%"};
  }


  public ngOnInit(): void {
    const challengeInfos = this.backend.getChallengeApp("Token " + this.applicant.applicationKey, this.applicant.applicationId.toString())
        .subscribe((data) => this.challenge = {
          challengeId: data.challenge.challengeId,
          challengeHeading: data.challenge.challengeHeading,
          challengeText: data.challenge.challengeText
        });
  }

  public changeTab(id: string): void {
    let elementActiveChallenge = <HTMLLabelElement>document.getElementById('tab_active_challenges');
    let elementArchive = <HTMLLabelElement>document.getElementById('tab_archiv');

    switch(id) {
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
    if(element !== null && element !== undefined) {    
      let parentElement = element.parentElement;
      
      if(parentElement !== null && parentElement !== undefined) {
        parentElement.querySelector(".nested")!.classList.toggle("active");
        element.classList.toggle("caret-down");
      }
    }
  }

  public checkboxChallengeChange(): void {

  }

  public checkboxStatusChange(): void {

  }

  public checkboxTimeLimitChange(): void {

  }

  public getChallengeHeading(challengeId: number): string {
    let elementHeading = this.challengeArray.find(element => element.challengeId === challengeId)?.challengeHeading;

    if(elementHeading === undefined) {
      return 'Error: Challenge not found';
    }
    return elementHeading;
  }

  public getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'not uploaded yet';
      case 1:
        return 'not uploaded yet';
      case 2:
        return 'uploaded';
      case 3:
        return 'uploaded';
      case 4: 
        return 'not submitted in time';
      case 5:
        return 'archived';
      default:
        return 'given status is unknown: ' + status;
    }
    
  }

  public getTimeLimit(app: Application): number {
    return 2;
  }

  public getSubmissionDateText(submissionDate: number): string {
    if(submissionDate === 0 || submissionDate === null || submissionDate === undefined) {
      return 'not uploaded in time';
    }
    return '' + submissionDate;
  };


  public openDialogActiveChallenges(application: Application): void {
    DialogComponent.name;
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Applicant ' + application.applicationId,
        description: {
          important: 'Open Project on GitHub',
          details: 'Test'
        },
        buttons: {
          left: { title: 'Archive', look: 'primary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
    });
  }

  public openDialogArchiv(application: Application): void {
    DialogComponent.name;
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Applicant ' + application.applicationId,
        description: {
          important: 'Open Project on GitHub',
          details: 'Test'
        },
        buttons: {
          left: { title: 'Archive', look: 'primary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
    });
  }
}
