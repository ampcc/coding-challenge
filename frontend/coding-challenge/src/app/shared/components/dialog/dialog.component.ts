import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule
  ]
})
export class DialogComponent {
  days: number = 0;
  challenge?: string = '';

  daysError: boolean = false;
  challengeError: boolean = false;

  daysErrorText: string = 'Please select at least a new Challenge or time limit!';
  challengeErrorText: string = 'Please select at least a new Challenge or time limit!';

  noOtherChallenges: boolean = false;

  oneButton: boolean = false;
  twoButtons: boolean = false;
  threeButtons: boolean = false;

  // The dialog element expects at least a title string
  // Apart from that it can handle a description and two buttons
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string,
    description: {
      link: string,
      url: string,
      important: string,
      details: string,
      extend: boolean,
      challenges: [{
        id: string,
        heading: string
      }],
      images: [string],
    },
    buttons: {
      left: {
        title: string,
        look: string,
      },
      middle: {
        title: string,
        look: string,
      },
      right: {
        title: string,
        look: string
      }
    }
  },
    public dialogRef: MatDialogRef<DialogComponent>, private ngZone: NgZone) {
    if (data.buttons.left && data.buttons.middle && data.buttons.right) {
      this.threeButtons = true;
    } else if ((data.buttons.left && data.buttons.middle) || (data.buttons.left && data.buttons.right) || (data.buttons.middle && data.buttons.right)) {
      this.twoButtons = true;
    } else if (data.buttons.left || data.buttons.middle || data.buttons.right) {
      this.oneButton = true;
    }
  }

  // The Dialog can be closed with the press of a button
  public closeDialog(state: number) {
    if (this.data.description && (this.data.description.extend || this.data.description.challenges) && state == 1) {
      var response;
      var expiryTime;
      this.daysError = false;
      this.challengeError = false;
      this.noOtherChallenges = false;

      if (this.data.description.extend) {
        if (this.days > 21) {
          this.daysErrorText = 'Please enter a number between 1 and 21 or 0!';
          this.daysError = true;
        } else if (this.days < 1) {
          expiryTime = undefined;
        } else {
          expiryTime = (new Date().getTime() / 1000) + (this.days * 24 * 60 * 60);
        }
      }

      if (this.data.description.challenges) {
        this.challenge = (<HTMLSelectElement>document.getElementById('dropdown')).value;
        if (this.challenge === '' || this.challenge === 'none') {
          this.challenge = undefined;
        } else if (this.challenge === 'random') {
          console.log(this.data.description.challenges);
          if (this.data.description.challenges[0] === undefined) {
            this.challenge = undefined;
            this.noOtherChallenges = true;
          } else {
            this.challenge = this.data.description.challenges[Math.floor(Math.random() * (this.data.description.challenges.length))].id;
          }
        }
        if (this.days == 0 && this.challenge === undefined) {
          this.challengeError = true;
          if (this.noOtherChallenges) {
            this.challengeErrorText = 'Unfortunately there are no other Challenges available!';
          } else {
            this.daysErrorText = 'Please select at least a new Challenge or time limit!';
            this.challengeErrorText = 'Please select at least a new Challenge or time limit!';
            this.daysError = true;
          }
        }
      }
      if (!this.daysError && !this.challengeError) {
        response = {
          s: state,
          e: expiryTime,
          c: this.challenge,
        };
        this.dialogRef.close(response);
      }
    } else {
      this.dialogRef.close(state);
    }
  }
}
