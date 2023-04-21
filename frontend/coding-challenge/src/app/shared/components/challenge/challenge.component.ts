import {Component, ViewEncapsulation} from '@angular/core';
import {BackendService} from 'src/app/core/backend.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Challenge } from '../../models/challenge';
import { Application } from '../../models/application';

@Component({
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    NgFor,
    FormsModule
  ],
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChallengeComponent {
  challenge: Challenge;
  applicant: Application;
  
  public time: string = '2 days 40 hours 35 minutes';
  public heading: string = 'Lorem ipsum';
  public challengeText: string = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

  public hideProgLang: boolean = true;
  public hideOpSys: boolean = true;
  public hideSuccess: boolean = true;
  public hideUpload: boolean = false;

  public os: string = 'default';
  public pl: string = 'default';

  public fileArray: File[] = [];


  public constructor(private backend: BackendService) {
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

    //this.heading = challengeInfos.challengeHeading;
    //this.challengeText = challengeInfos.challengeText;

    //this.time = this.backend.getApplicant({passwordHash: '', adminKey: '', username: ''} ,0).expiryDate;
  }


  public selectionProgLang(): void {
    var selectedOption = <HTMLSelectElement>document.getElementById('selectProgLang');

    if(selectedOption.value == "other") {
      this.hideProgLang = false;
    } else {
      this.hideProgLang = true;
    }
  }


  public selectionOpSys(): void {
    var selectedOption = <HTMLSelectElement>document.getElementById('selectOpSys');

    if(selectedOption.value == "other") {
      this.hideOpSys = false;
    } else {
      this.hideOpSys = true;
    }
  }


  public uploadFileHandler(event: Event): any {
    var files = (event.target as HTMLInputElement).files;
    
    if(typeof files !== 'undefined' && files !== null) {
      for(let i = 0; i < files?.length; i++) {
        // checks if the filesize is greater than 5 GB (= 5368709120 Byte)
        // 50 MB = 52,428,800 Byte
        // and if the filetype is not supported
        if(files[i].size > 52428800 || !files[i].name.includes('.zip')) {
          console.log('File is too big or has the wrong filetype');
          alert('The file ' + files[i].name + 'is too big or has the wrong filetype');
          continue;
        } 

        this.fileArray.push(files[i]);
      }
    }  
  }

  public deleteFile(index: number): void {
    let deletedElement = this.fileArray[index];

    this.fileArray = this.fileArray.filter((element) => {
      return element !== deletedElement;
    });
  }

  public formatBytes(size: any): String {
    if (size >= 1073741824) { size = (size / 1073741824).toFixed(2) + " GB"; }
    else if (size >= 1048576)    { size = (size / 1048576).toFixed(2) + " MB"; }
    else if (size >= 1024)       { size = (size / 1024).toFixed(2) + " KB"; }
    return size;
  }


  public submitChallenge(): void {
    let required = false;
    let resultPl = this.pl;
    let resultOs = this.os;

    if(resultPl === 'default') {
      alert('Programming language required');
      required = true;
    } else if(resultPl === 'other') {
      resultPl = (document.getElementById('progLang') as HTMLInputElement).value;
    }

    if(resultOs === 'default') {
      alert('Operating system required');
      required = true;
    } else if(resultOs === 'other') {
      resultOs = (document.getElementById('opSys') as HTMLInputElement).value;;
    }

    if(this.fileArray.length === 0) {
      alert('No files for upload selected');
      required = true;
    }

    if(!required) {
      alert('Success: ' + resultOs + ', ' + resultPl);
      this.hideSuccess = false;
      this.hideUpload = true;
      this.backend.uploadChallenge("Token" + this.applicant.applicationKey, resultOs, resultPl);
      this.backend.submitChallenge("Token " + this.applicant.applicationKey);
    }
  }

}
