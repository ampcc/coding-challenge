import { Component } from '@angular/core';
import { BackendService } from 'src/app/core/backend.service';
import { Challenge } from '../../models/challange';
import { Application } from '../../models/application';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  challenge: Challenge;
  applicant: Application;

    constructor(private backendService: BackendService){
      this.challenge = {challengeId: 0, challengeHeading: '',challengeText: ''};
      this.applicant = {applicationId: "", applicationKey:"", challengeId: 0 , expiryDate: "", githubRepoURL: "", operatingSystem: "", programmingLanguage: "", status: 0, submissionDate: "", passphrase: "a4Xz!5T%"};

    }
    loginWithPassphrase(){
      this.backendService.loginWithPassphrase(this.applicant.passphrase).subscribe((data) => {
        this.applicant.applicationKey = data.applicationToken;
        this.applicant.applicationId = data.applicationId;
      });
    }
    loginWithAppKey(){
      this.backendService.loginWithAppKey('Token c12346193ee69f979b16f922eeb603afe627a2abc659d1ac968730f968795d6','A0000113').subscribe((data) => {
        console.log(data);
        this.applicant.applicationKey = data.applicationToken;
      });
    }

    getApplicant(){

    }

    getChallenge(){
      this.backendService.getChallengeApp("Token " + this.applicant.applicationKey, this.applicant.applicationId.toString()).subscribe((data) => this.challenge = {
       challengeId: data.challenge.challengeId,
        challengeHeading: data.challenge.challengeHeading,
        challengeText: data.challenge.challengeText
      });
    }

}
