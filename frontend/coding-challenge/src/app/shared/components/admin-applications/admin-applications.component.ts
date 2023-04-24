import { Component, ViewEncapsulation } from '@angular/core';
import {BackendService} from 'src/app/core/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Challenge } from '../../models/challenge';
import { Application } from '../../models/application';

@Component({
  standalone: true,
  imports: [
    NgFor,
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

  public applicantsArray: File[] = [];


  public constructor(private backend: BackendService, public dialog: MatDialog,) {
    this.challenge = {challengeId: 0, challengeHeading: '',challengeText: ''};
    this.applicant = {applicationId: "", applicationKey:"", challengeId: 0 , expiryDate: "", githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 0, submissionDate: "", passphrase: "a4Xz!5T%"};
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
}
