/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BackendService } from 'src/app/core/backend.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogComponent } from '../dialog/dialog.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    MatProgressSpinnerModule
  ],
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChallengeComponent implements OnInit {
  application: Application;
  private applicationToken: string | null;

  public time = 'No data available!';
  public heading = 'No data available!';
  public challengeText = 'No data available!';

  public hideContentIntro = false;
  public hideContentChallenge = true;
  public hideContentUpload = true;

  public hideProgLang = true;
  public hideOpSys = true;
  public hideSuccess = true;
  public hideUpload = false;
  public hideLoading = true;

  public msgProgLang = '';
  public msgOpSys = '';
  public msgFileUpload = '';
  public hideMsgProgLang = true;
  public hideMsgOpSys = true;
  public hideMsgFileUpload = true;

  public os = 'default';
  public pl = 'default';

  public fileArray: File[] = [];


  public constructor(private backend: BackendService, public dialog: MatDialog, private router: Router) {
    this.application = { applicationId: "", applicationKey: "", challengeId: 0, expiry: 0, githubRepo: "", operatingSystem: "", programmingLanguage: "", status: 0, submission: 0, passphrase: "a4Xz!5T%" };
    this.applicationToken = null;
  }


  public ngOnInit(): void {
    // Check if Application Token is available
    this.applicationToken = window.sessionStorage.getItem('Auth-Token');
    if (this.applicationToken === null) {
      this.router.navigateByUrl("/unauthorized");
    } else {

      // Get the current Status
      this.backend.getStatus(this.applicationToken).subscribe((response) => {
        if (response.status >= 2) {
          window.sessionStorage.clear();
          this.router.navigateByUrl("/gone");
        }
        // get all received Parameters from the response
        this.application = {
          applicationId: response.applicationId, applicationKey: "", challengeId: response.challengeId, expiry: response.expiry, githubRepo: "",
          operatingSystem: response.operatingSystem, programmingLanguage: response.programmingLanguage, submission: 0, status: response.progress
        };
        this.time = this.backend.calcRemainingTime(new Date().getTime(), this.application.expiry);
        // in case of errors redirect to the correct error page
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

  /**
   * Changes the tab and shows the associated content.
   * This also includes dynamically setting the style of the tabs
   * @param id The id of the tab-html element
   */
  public changeTab(id: string): void {
    const elementIntro = <HTMLLabelElement>document.getElementById('tabIntro');
    const elementChallenge = <HTMLLabelElement>document.getElementById('tabChallenge');
    const elementUpload = <HTMLLabelElement>document.getElementById('tabUpload');

    switch (id) {
      case 'tabIntro':
        this.hideContentIntro = false;
        this.hideContentChallenge = true;
        this.hideContentUpload = true;

        elementIntro.setAttribute("style", "border-bottom: 2px solid black;");
        elementChallenge.setAttribute("style", "border-bottom: none;");
        elementUpload.setAttribute("style", "border-bottom: none;");
        break;
      case 'tabChallenge':
        this.hideContentChallenge = false;
        this.hideContentIntro = true;
        this.hideContentUpload = true;

        elementIntro.setAttribute("style", "border-bottom: none;");
        elementChallenge.setAttribute("style", "border-bottom: 2px solid black;");
        elementUpload.setAttribute("style", "border-bottom: none;");
        break;
      case 'tabUpload':
        this.hideContentUpload = false;
        this.hideContentIntro = true;
        this.hideContentChallenge = true;

        elementIntro.setAttribute("style", "border-bottom: none;");
        elementChallenge.setAttribute("style", "border-bottom: none;");
        elementUpload.setAttribute("style", "border-bottom: 2px solid black;");
        break;
    }

  }

  /**
   * Stores the selected programming language inside an attribute.
   * If the user selected "other" an input element is displayed for the user to type his programming language
   */
  public selectionProgLang(): void {
    const selectedOption = <HTMLSelectElement>document.getElementById('selectProgLang');

    if (selectedOption.value == "other") {
      this.hideProgLang = false;
    } else {
      this.hideProgLang = true;
    }
  }

  /**
   * Stores the selected operating system inside an attribute.
   * If the user selected "other" an input element is displayed for the user to type his operating system
   */
  public selectionOpSys(): void {
    const selectedOption = <HTMLSelectElement>document.getElementById('selectOpSys');

    if (selectedOption.value == "other") {
      this.hideOpSys = false;
    } else {
      this.hideOpSys = true;
    }
  }

  /**
   * Opens a modal dialog that displays instructions on which folder structure the uploaded file should have
   */
  public openDialogInfo(): void {
    DialogComponent.name;
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Info: File structure',
        description: {
          important: 'Please pay attention to the following folder structure when uploading:',
          details: 'The Projectfolder has to be directly under the .zip File and the Readme File has to be inside the Projectfolder!'
            + ' <br> <br><pre>YourCode.zip <br>└── ProjectFolder/ <br>    ├── src/ <br>    ├── data/ <br>    ├── test/ <br>    ├── ReadMe.md <br>    └── ....'
        },
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });
  }

  /**
   * Checks if the following requirements for the file are met before calling the checkUploadedZipContent(file) method:
   * - There is no file already uploaded
   * - The size is smaller than 50 MB
   * - The file hast the correct file format (.zip)
   *
   * If any requirements fail, an error message is displayed
   * @param event
   */
  public uploadFileHandler(event: Event): any {
    const files = (event.target as HTMLInputElement).files;
    const element = <HTMLInputElement>document.getElementById('DragnDropBlock');

    if (typeof files !== 'undefined' && files !== null) {
      // checks if the filesize is greater than 5 GB (= 5368709120 Byte)
      // 50 MB = 52,428,800 Byte
      // and if the filetype is not supported
      if (this.fileArray.length !== 0) {
        this.msgFileUpload = 'You already uploaded a file. Please delete that file before uploading another one.';
        this.hideMsgFileUpload = false;

        element.setAttribute("style", "border-color:red;");
      } else if (files[0].size > 52428800 && !files[0].name.includes('.zip')) {
        this.msgFileUpload = 'The file ' + files[0].name + ' has the wrong filetype and is too big';
        this.hideMsgFileUpload = false;

        element.setAttribute("style", "border-color:red; ");
      } else if (files[0].size > 52428800) {
        this.msgFileUpload = 'The file ' + files[0].name + ' is too big';
        this.hideMsgFileUpload = false;

        element.setAttribute("style", "border-color:red;");
      } else if (!files[0].name.includes('.zip')) {
        this.msgFileUpload = 'The file ' + files[0].name + ' has the wrong filetype';
        this.hideMsgFileUpload = false;

        element.setAttribute("style", "border-color:red;");
      } else {
        this.checkUploadedZipContent(files[0]);
        // this.hideMsgFileUpload = true;
        // element.setAttribute("style", "border-color:lightgrey;");
      }
    }
  }

  // Method to check the uploaded File structure in the frontend
  /**
   * Checks whether the uploaded file has the correct folder structure. Pushes the file to the fileArray on success
   * @param file The uploaded and compressed file
   */
  public checkUploadedZipContent(file: File): void {
    const element = <HTMLInputElement>document.getElementById('DragnDropBlock');
    const jsZip = require('jszip');
    let result = true;
    let isSecondLayerFile = false;
    // load the zip and ignore all MACOSX and DS_Store files
    jsZip.loadAsync(file).then((zip: any) => {
      Object.keys(zip.files).filter(v => v.indexOf("__MACOSX/") === -1 && v.indexOf("DS_Store") === -1).forEach((filename) => {
        if (filename.indexOf(".") !== -1) {
          if ((filename.split("/").length - 1) === 0) {
            result = false;
          } else if ((filename.split("/").length - 1) === 1) {
            isSecondLayerFile = true;
          }
        }
      })
      if (!isSecondLayerFile) {
        result = false;
      }
      if (result) {
        this.fileArray.push(file);
        this.hideMsgFileUpload = true;
        element.setAttribute("style", "border-color:lightgrey;");
      } else {
        this.hideMsgFileUpload = false;
        this.msgFileUpload = 'The file ' + file.name + ' has the wrong folder structure';
        element.setAttribute("style", "border-color:red; ");
        this.openDialogInfo();
      }
    })
  }

  /**
   * Deletes the currently uploaded file
   * @param index The index of the file in the underlying fileArray
   */
  public deleteFile(index: number): void {
    const fileInput = <HTMLInputElement>document.getElementById('fileHandler');
    fileInput.files = new DataTransfer().files;

    const deletedElement = this.fileArray[index];
    this.fileArray = this.fileArray.filter((element) => {
      return element !== deletedElement;
    });
  }

  /**
   * Formates the bytes into a more adequate unit
   * @param size The size of the uploaded and compressed file in bytes
   * @returns The size formatted in either KB, MB or GB
   */
  public formatBytes(size: any): string {
    if (size >= 1073741824) { size = (size / 1073741824).toFixed(2) + " GB"; }
    else if (size >= 1048576) { size = (size / 1048576).toFixed(2) + " MB"; }
    else if (size >= 1024) { size = (size / 1024).toFixed(2) + " KB"; }
    return '' + size;
  }

  /**
   * Checks if all requirements for an successfull submit of a solution are met:
   * - All failed requirements are highlighted and a message for the user is displayed
   * - If all requirements are met, a call to the backend server is performed
   * - While the user is waiting for a response, the html is switched to display a progress spinner
   * - When the response is received, the html is either once again switched to display a success image or the user gets redirected in case of any error reponse
   */
  public submitChallenge(): void {
    let required = false;
    let resultPl = this.pl;
    let resultOs = this.os;

    const elementProgLang = <HTMLSelectElement>document.getElementById('selectProgLang');
    const elementOpSys = <HTMLSelectElement>document.getElementById('selectOpSys');
    const elementDragnDrop = <HTMLInputElement>document.getElementById('DragnDropBlock');

    if (resultPl === 'default') {
      this.hideMsgProgLang = false;
      this.msgProgLang = 'Programming language required';
      elementProgLang.setAttribute("style", "border-color:red;");
      required = true;
    } else if (resultPl === 'other') {
      const elementInputProgLang = <HTMLInputElement>document.getElementById('otherProgLang');

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
      const elementInputOpSy = <HTMLInputElement>document.getElementById('otherOpSys');

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
      this.hideMsgFileUpload = false;
      this.msgFileUpload = 'No files for upload selected';
      elementDragnDrop.setAttribute("style", "border-color:red;");
      required = true;
    } else {
      this.hideMsgFileUpload = true;
      elementDragnDrop.setAttribute("style", "border-color:lightgrey;");
    }

    if (!required) {
      this.hideUpload = true;
      this.hideLoading = false;
      this.backend.uploadChallenge(this.applicationToken, resultOs, resultPl, this.fileArray[0]).subscribe((response) => {
        this.hideSuccess = false;
        this.hideUpload = true;
        this.hideLoading = true;
        this.hideMsgFileUpload = true;
      }, (error) => {
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
