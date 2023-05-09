import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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
    public dialogRef: MatDialogRef<DialogComponent>) {
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
    if (this.data.description.extend && state == 1) {
      var response;
      var expiryTime;
      this.daysError = false;
      this.challengeError = false;

      if (this.days < 1 || this.days > 21) {
        this.daysError = true;
      } else {
        expiryTime = new Date().getTime() + (this.days * 24 * 60 * 60 * 1000);
      }
      if (this.data.description.challenges) {
        this.challenge = (<HTMLSelectElement>document.getElementById('dropdown')).value;
        if (this.challenge = '') {
          this.challengeError = true;
        } else if (this.challenge='none') {
          this.challenge = undefined;
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
