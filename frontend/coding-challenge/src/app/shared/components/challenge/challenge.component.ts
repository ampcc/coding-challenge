import {Component, ViewEncapsulation} from '@angular/core';
import { BackendService } from 'src/app/core/backend.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'; 

@Component({
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
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
  // public selectedItem = '';

  public progLang: boolean = true;
  public opSys: boolean = true;

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

}
