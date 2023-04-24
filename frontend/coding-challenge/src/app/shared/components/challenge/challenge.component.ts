import {Component, ViewEncapsulation} from '@angular/core';
import {BackendService} from 'src/app/core/backend.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
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
  
  public time: string = '2 days 4 hours 35 minutes';
  public heading: string = 'Lorem ipsum';
  public challengeText: string = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

  public hideContentIntro: boolean = false;
  public hideContentChallenge: boolean = true;
  public hideContentUpload: boolean = true;

  public hideProgLang: boolean = true;
  public hideOpSys: boolean = true;
  public hideSuccess: boolean = true;
  public hideUpload: boolean = false;

  public msgProgLang: string ='';
  public msgOpSys: string ='';
  public msgFileUplod: string ='';
  public hideMsgProgLang: boolean = true;
  public hideMsgOpSys: boolean = true;
  public hideMsgFileUplod: boolean = true;

  public os: string = 'default';
  public pl: string = 'default';

  public fileArray: File[] = [];


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

    //this.heading = challengeInfos.challengeHeading;
    //this.challengeText = challengeInfos.challengeText;

    //this.time = this.backend.getApplicant({passwordHash: '', adminKey: '', username: ''} ,0).expiryDate;
  }


  public changeTab(id: string): void {
    let elementIntro = <HTMLLabelElement>document.getElementById('tab_intro');
    let elementChallenge = <HTMLLabelElement>document.getElementById('tab_challenge');
    let elementUpload = <HTMLLabelElement>document.getElementById('tab_upload');

    switch(id) {
      case 'tab_intro':
        this.hideContentIntro = false;
        this.hideContentChallenge = true;
        this.hideContentUpload = true;

        elementIntro.setAttribute("style", "border-bottom: 2px solid black;");
        elementChallenge.setAttribute("style", "border-bottom: none;");
        elementUpload.setAttribute("style", "border-bottom: none;");
        break;
      case 'tab_challenge':
        this.hideContentChallenge = false;
        this.hideContentIntro = true;
        this.hideContentUpload = true;

        elementIntro.setAttribute("style", "border-bottom: none;");
        elementChallenge.setAttribute("style", "border-bottom: 2px solid black;");
        elementUpload.setAttribute("style", "border-bottom: none;");
        break;
      case 'tab_upload':
        this.hideContentUpload = false;
        this.hideContentIntro = true;
        this.hideContentChallenge = true;

        elementIntro.setAttribute("style", "border-bottom: none;");
        elementChallenge.setAttribute("style", "border-bottom: none;");
        elementUpload.setAttribute("style", "border-bottom: 2px solid black;");
        break;
    }
    
  }


  public selectionProgLang(): void {
    let selectedOption = <HTMLSelectElement>document.getElementById('selectProgLang');

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


  public openDialogInfo(): void {
    DialogComponent.name;
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Info: File structure',
        description: {
          important: 'Please pay attention to the following folder structure when uploading:',
          details: 'project.zip -> project -> src -> ...'
        },
      },
    });
  }


  public uploadFileHandler(event: Event): any {
    var files = (event.target as HTMLInputElement).files;
    var element = <HTMLInputElement>document.getElementById('DragnDropBlock');
    
    if(typeof files !== 'undefined' && files !== null) {
      for(let i = 0; i < files?.length; i++) {
        // checks if the filesize is greater than 5 GB (= 5368709120 Byte)
        // 50 MB = 52,428,800 Byte
        // and if the filetype is not supported
        if(files[i].size > 52428800) {
          this.msgFileUplod = 'The file ' + files[i].name + ' is too big';
          this.hideMsgFileUplod = false;

          element.setAttribute("style", "border-color:red;");

          continue;
        } else if (!files[i].name.includes('.zip')) {
          this.msgFileUplod = 'The file ' + files[i].name + ' has the wrong filetype';
          this.hideMsgFileUplod = false;

          element.setAttribute("style", "border-color:red;");

          continue;
        } else if (files[i].size > 52428800 && !files[i].name.includes('.zip')) {
          this.msgFileUplod = 'The file ' + files[i].name + ' has the wrong filetype and is too big';
          this.hideMsgFileUplod = false;

          element.setAttribute("style", "border-color:red; ");

          continue;
        } else {
          this.hideMsgFileUplod = true;
          this.fileArray.push(files[i]);

          element.setAttribute("style", "border-color:lightgrey;");
        }
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

    let elementProgLang = <HTMLSelectElement>document.getElementById('selectProgLang');
    var elementOpSys = <HTMLSelectElement>document.getElementById('selectOpSys');
    var elementDragnDrop = <HTMLInputElement>document.getElementById('DragnDropBlock');

    if(resultPl === 'default') {
      this.hideMsgProgLang = false;
      this.msgProgLang = 'Programming language required';
      elementProgLang.setAttribute("style", "border-color:red;");
      required = true;
    } else if(resultPl === 'other') {
      let elementInputProgLang = <HTMLInputElement>document.getElementById('progLang');

      resultPl = elementInputProgLang.value;
      
      if(resultPl === '') {
        this.hideMsgProgLang = false;
        this.msgProgLang = 'Programming language required';
        elementProgLang.setAttribute("style", "border-color:red;");
        elementInputProgLang.setAttribute("style", "border-color:red;");
        required = true;
      } else {
        this.hideMsgProgLang = true;
        required = false;
        elementProgLang.setAttribute("style", "border-color:lightgrey;");
        elementInputProgLang.setAttribute("style", "border-color:lightgrey;");
      }
    } else {
      this.hideMsgProgLang = true;
      elementProgLang.setAttribute("style", "border-color:lightgrey;");
    }

    if(resultOs === 'default') {
      this.hideMsgOpSys = false;
      this.msgOpSys = 'Operating system required';
      elementOpSys.setAttribute("style", "border-color:red;");
      required = true;
    } else if(resultOs === 'other') {
      let elementInputOpSy = <HTMLInputElement>document.getElementById('opSys');
      
      resultOs = elementInputOpSy.value;

      if(resultOs === '') {
        this.hideMsgOpSys = false;
        this.msgOpSys = 'Operating system required';
        elementOpSys.setAttribute("style", "border-color:red;");
        elementInputOpSy.setAttribute("style", "border-color:red;");
        required = true;
      } else {
        this.hideMsgOpSys = true;
        required = false;
        elementOpSys.setAttribute("style", "border-color:lightgrey;");
        elementInputOpSy.setAttribute("style", "border-color:lightgrey;");
      }
    } else {
      this.hideMsgOpSys = true;
      elementOpSys.setAttribute("style", "border-color:lightgrey;");
    }

    if(this.fileArray.length === 0) {
      this.hideMsgFileUplod = false;
      this.msgFileUplod = 'No files for upload selected';
      elementDragnDrop.setAttribute("style", "border-color:red;");
      required = true;
    } else {
      this.hideMsgFileUplod = true;
      elementDragnDrop.setAttribute("style", "border-color:lightgrey;");
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
