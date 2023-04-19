import {Component, ViewEncapsulation} from '@angular/core';
import {BackendService} from 'src/app/core/backend.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {NgFor} from '@angular/common';

@Component({
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    NgFor
  ],
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChallengeComponent {
  public time: string = '2 days 40 hours 35 minutes';
  public heading: string = 'Lorem ipsum';
  public challenge: string = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

  public progLang: boolean = true;
  public opSys: boolean = true;

  public fileArray: File[] = [];


  public constructor(private backend: BackendService) {
  }


  public ngOnInit(): void {
    const challengeInfos = this.backend.getChallenge('');

    //this.heading = challengeInfos.challengeHeading;
    //this.challenge = challengeInfos.challengeText;

    //this.time = this.backend.getApplicant({passwordHash: '', adminKey: '', username: ''} ,0).expiryDate;
  }


  public selectionProgLang(): void {
    var selectedOption = <HTMLSelectElement>document.getElementById('selectProgLang');

    if(selectedOption.value == "other") {
      this.progLang = false;
    } else {
      this.progLang = true;
    }
  }


  public selectionOpSys(): void {
    var selectedOption = <HTMLSelectElement>document.getElementById('selectOpSys');

    if(selectedOption.value == "other") {
      this.opSys = false;
    } else {
      this.opSys = true;
    }
  }


  public uploadFileHandler(event: Event): any {
    var files = (event.target as HTMLInputElement).files;
    
    if(typeof files !== 'undefined' && files !== null) {
      for(let i = 0; i < files?.length; i++) {
        // checks if the filesize is greater than 5 GB (= 536879120 Byte)
        // and if the filetype is not supported
        if(files[i].size > 536879120 || !files[i].name.includes('.zip')) {
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
}
