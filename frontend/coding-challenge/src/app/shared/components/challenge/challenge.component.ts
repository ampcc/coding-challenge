import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BackendService } from 'src/app/core/backend.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Challenge } from '../../models/challenge';
import { Application } from '../../models/application';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import * as JSZip from 'jszip';

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

export class ChallengeComponent implements OnInit {
  applicant: Application;
  private applicationToken: string | null;

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

  public msgProgLang: string = '';
  public msgOpSys: string = '';
  public msgFileUplod: string = '';
  public hideMsgProgLang: boolean = true;
  public hideMsgOpSys: boolean = true;
  public hideMsgFileUplod: boolean = true;

  public os: string = 'default';
  public pl: string = 'default';

  public fileArray: File[] = [];


  public constructor(private backend: BackendService, public dialog: MatDialog, private router: Router) {
    this.applicant = { applicationId: "", applicationKey: "", challengeId: 0, expiry: 0, githubRepo: "", operatingSystem: "", programmingLanguage: "", status: 0, submission: 0, passphrase: "a4Xz!5T%" };
    this.applicationToken = null;
  }


  public ngOnInit(): void {
    // Check if Application Token is available
    this.applicationToken = window.sessionStorage.getItem('Auth-Token');
    if (this.applicationToken === null) {
      this.router.navigateByUrl("/unauthorized")
    } else {

      // Get the current Status
      this.backend.getStatus(this.applicationToken).subscribe((response) => {
        this.applicant = {
          applicationId: response.applicationId, applicationKey: "", challengeId: response.challengeId, expiry: response.expiry, githubRepo: "",
          operatingSystem: response.operatingSystem, programmingLanguage: response.programmingLanguage, submission: 0, status: response.progress
        };
        this.time = this.backend.calcRemainingTime(new Date().getTime(), this.applicant.expiry);
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
      }, () => {
        // Get the Challenge
        this.backend.getChallengeApp(this.applicationToken).subscribe((response) => {
          this.challengeText = response.challengeText;
          this.heading = response.challengeHeading;
        }, (error: HttpErrorResponse) => {
          switch (error.status) {
            case 403:
              window.sessionStorage.clear();
              this.router.navigateByUrl("/forbidden");
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
      });
    }
  }


  public changeTab(id: string): void {
    let elementIntro = <HTMLLabelElement>document.getElementById('tab_intro');
    let elementChallenge = <HTMLLabelElement>document.getElementById('tab_challenge');
    let elementUpload = <HTMLLabelElement>document.getElementById('tab_upload');

    switch (id) {
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

    if (selectedOption.value == "other") {
      this.hideProgLang = false;
    } else {
      this.hideProgLang = true;
    }
  }


  public selectionOpSys(): void {
    var selectedOption = <HTMLSelectElement>document.getElementById('selectOpSys');

    if (selectedOption.value == "other") {
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
          details: 'All source files have to be directly under the .zip file! <br><pre>YourCode.zip <br>├── src1.java <br>├── src2.py <br>├── src3.c <br>└── ....'
        },
      },
    });
  }


  public uploadFileHandler(event: Event): any {
    var files = (event.target as HTMLInputElement).files;
    var element = <HTMLInputElement>document.getElementById('DragnDropBlock');

    if (typeof files !== 'undefined' && files !== null) {
      // checks if the filesize is greater than 5 GB (= 5368709120 Byte)
      // 50 MB = 52,428,800 Byte
      // and if the filetype is not supported
      if (this.fileArray.length !== 0) {
        this.msgFileUplod = 'You already uploaded a file. Please delete that file before uploading another one.';
        this.hideMsgFileUplod = false;

        element.setAttribute("style", "border-color:red;");
      } else if (files[0].size > 52428800) {
        this.msgFileUplod = 'The file ' + files[0].name + ' is too big';
        this.hideMsgFileUplod = false;

        element.setAttribute("style", "border-color:red;");
      } else if (!files[0].name.includes('.zip')) {
        this.msgFileUplod = 'The file ' + files[0].name + ' has the wrong filetype';
        this.hideMsgFileUplod = false;

        element.setAttribute("style", "border-color:red;");
      } else if (files[0].size > 52428800 && !files[0].name.includes('.zip')) {
        this.msgFileUplod = 'The file ' + files[0].name + ' has the wrong filetype and is too big';
        this.hideMsgFileUplod = false;

        element.setAttribute("style", "border-color:red; ");
      } else {
        this.checkUploadedZipContent(files[0]);
        this.hideMsgFileUplod = true;
        element.setAttribute("style", "border-color:lightgrey;");
      }
    }
  }

public checkUploadedZipContent(file:File): void{
  var element = <HTMLInputElement>document.getElementById('DragnDropBlock');
  const jsZip = require('jszip');
  var result = true;
  var isSecondLayerFile = false;
  jsZip.loadAsync(file).then((zip: any) => {
    Object.keys(zip.files).filter(v => v.indexOf("__MACOSX/") === -1 && v.indexOf("DS_Store") === -1).forEach((filename) => {
      if(filename.indexOf(".") !== -1){
        if((filename.split("/").length - 1) === 0){
          result = false;
        }else if((filename.split("/").length - 1) === 1){
          isSecondLayerFile = true;
        }
      }
    })
    if(!isSecondLayerFile){
      result = false;
    }
    if(result){
      this.fileArray.push(file);
    }else {
      this.hideMsgFileUplod = false;
      this.msgFileUplod = 'The file ' + file.name + ' has the wrong folder structure';
      element.setAttribute("style", "border-color:red; ");
      this.openDialogInfo();
    }
  })

}

  public deleteFile(index: number): void {
    let deletedElement = this.fileArray[index];

    this.fileArray = this.fileArray.filter((element) => {
      return element !== deletedElement;
    });
  }

  public formatBytes(size: any): String {
    if (size >= 1073741824) { size = (size / 1073741824).toFixed(2) + " GB"; }
    else if (size >= 1048576) { size = (size / 1048576).toFixed(2) + " MB"; }
    else if (size >= 1024) { size = (size / 1024).toFixed(2) + " KB"; }
    return size;
  }


  public submitChallenge(): void {
    let required = false;
    let resultPl = this.pl;
    let resultOs = this.os;

    let elementProgLang = <HTMLSelectElement>document.getElementById('selectProgLang');
    var elementOpSys = <HTMLSelectElement>document.getElementById('selectOpSys');
    var elementDragnDrop = <HTMLInputElement>document.getElementById('DragnDropBlock');

    if (resultPl === 'default') {
      this.hideMsgProgLang = false;
      this.msgProgLang = 'Programming language required';
      elementProgLang.setAttribute("style", "border-color:red;");
      required = true;
    } else if (resultPl === 'other') {
      let elementInputProgLang = <HTMLInputElement>document.getElementById('progLang');

      resultPl = elementInputProgLang.value;

      if (resultPl === '') {
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

    if (resultOs === 'default') {
      this.hideMsgOpSys = false;
      this.msgOpSys = 'Operating system required';
      elementOpSys.setAttribute("style", "border-color:red;");
      required = true;
    } else if (resultOs === 'other') {
      let elementInputOpSy = <HTMLInputElement>document.getElementById('opSys');

      resultOs = elementInputOpSy.value;

      if (resultOs === '') {
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

    if (this.fileArray.length === 0) {
      this.hideMsgFileUplod = false;
      this.msgFileUplod = 'No files for upload selected';
      elementDragnDrop.setAttribute("style", "border-color:red;");
      required = true;
    } else {
      this.hideMsgFileUplod = true;
      elementDragnDrop.setAttribute("style", "border-color:lightgrey;");
    }

    if (!required) {
      this.hideMsgFileUplod = false;
      this.msgFileUplod = "Uploading File. Please Wait."
      this.backend.uploadChallenge(this.applicationToken, resultOs, resultPl, this.fileArray[0]).subscribe((response) => {
        this.hideSuccess = false;
        this.hideUpload = true;
        this.hideMsgFileUplod = true;
      },(error) => {
        switch (error.status) {
          case 403:
            window.sessionStorage.clear();
            this.router.navigateByUrl("/forbidden");
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
  }
}
