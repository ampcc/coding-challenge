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
  days = 0;
  challenge?: string = '';

  daysError = false;
  challengeError = false;

  daysErrorText = 'Please select at least a new Challenge or time limit!';
  challengeErrorText = 'Please select at least a new Challenge or time limit!';

  noOtherChallenges = false;

  oneButton = false;
  twoButtons = false;
  threeButtons = false;

  // The dialog element expects at least a title as string
  // Additionally it can be used with a description including important informations, further details, a link, and one or more images
  // The dialog can also provide a dropdown for challenges when they are given and the extend flag is set to true
  // This also leads to a field for selecting days to extend with showing up
  // There's an additional option to add up o three buttons

  // Can be used like this in ts with only the title being mandatory (dialog has to be predefined as MatDialog):
  // let dialogRef = this.dialog.open(DialogComponent, {
  //   data: {
  //     title: 'x',
  //     description: {
  //       link: 'x',
  //       url: 'x',
  //       important: 'x',
  //       details: 'x',
  //       extend: true,
  //       challenges: [
  //         {
  //           id: '0',
  //           heading: 'x'
  //         },
  //         {
  //           id: '1',
  //           heading: 'y'
  //         },
  //       ],
  //       images: [
  //         'x',
  //         'y',
  //       ],
  //     },
  //     buttons: {
  //       left: { title: 'x', look: 'delete' },
  //       middle: { title: 'x', look: 'primary' },
  //       right: { title: 'x', look: 'secondary' }
  //     }
  //   },
  //   maxHeight: '85vh',
  //   minWidth: '30vw',
  // });

  // After closing the result can be accessed like this:
  // dialogRef.afterClosed().subscribe(result => { ... })
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
  }, public dialogRef: MatDialogRef<DialogComponent>) {
    // Checks whether any buttons exist and if so, how many
    if (data.buttons) {
      if (data.buttons.left && data.buttons.middle && data.buttons.right) {
        this.threeButtons = true;
      } else if ((data.buttons.left && data.buttons.middle) || (data.buttons.left && data.buttons.right) || (data.buttons.middle && data.buttons.right)) {
        this.twoButtons = true;
      } else if (data.buttons.left || data.buttons.middle || data.buttons.right) {
        this.oneButton = true;
      }
    }
  }

  // The Dialog can be closed with the press of a button
  // It will then send back a result depending on the clicked button
  public closeDialog(state: number) {
    // If the dialog was used to extend an applications time or change the challenge and the user wants to apply these, it is first checked if the input is correct
    if (this.data.description && (this.data.description.extend || this.data.description.challenges) && state == 1) {
      let response;
      let expiryTime = undefined;
      this.challenge = undefined;
      this.daysError = false;
      this.challengeError = false;
      this.noOtherChallenges = false;

      // Check the number of days to extend with
      // If it is between 1-21 the new expiry time gets calculated by using the current time and the number of extend days in seconds
      // If it is 0 or lower the expiry time is set to undefined to make it possible to only change the challenge
      // If it is higher than 21 an error message gets displayed
      if (this.data.description.extend) {
        if (this.days > 21) {
          this.daysErrorText = 'Please enter a number between 1 and 21 or 0!';
          this.daysError = true;
          expiryTime = undefined;
        } else if (this.days < 1) {
          expiryTime = undefined;
        } else {
          expiryTime = (new Date().getTime() / 1000) + (this.days * 24 * 60 * 60);
        }
      }

      // Check which challenge is selected
      // If a random one is selected a random challenge from the challenges array is used
      // Previously it is tested if there actually are any other challenges, else an error message gets displayed
      // If no challenge was selected the challenge is set to undefined to make it possible to only extend the days
      if (this.data.description.challenges) {
        this.challenge = (<HTMLSelectElement>document.getElementById('dropdown')).value;
        if (this.challenge === '' || this.challenge === 'none') {
          this.challenge = undefined;
        } else if (this.challenge === 'random') {
          console.log(this.data.description.challenges);
          if (this.data.description.challenges[0] === undefined) {
            this.challenge = undefined;
            this.noOtherChallenges = true;
            this.challengeError = true;
            this.challengeErrorText = 'Unfortunately there are no other Challenges available!';
          } else {
            this.challenge = this.data.description.challenges[Math.floor(Math.random() * (this.data.description.challenges.length))].id;
          }
        }
      }

      // If no time to expand with AND no new challenge is selected error messages get displayed
      // If a new challenge was supposed to be selected, but none was available an error message is only displayed underneath the dropdown field
      if (expiryTime === undefined && this.challenge === undefined) {
        this.daysError = true;
        this.challengeError = true;
        this.daysErrorText = 'Please select at least a new Challenge or time limit!';
        this.challengeErrorText = 'Please select at least a new Challenge or time limit!';
        if (this.noOtherChallenges) {
          this.daysError = false;
          this.challengeErrorText = 'Unfortunately there are no other Challenges available!';
        }
        // If at least one proper selection was made the dialog returns a response including the state number, expiry time and challenge
      } else {
        response = {
          s: state,
          e: expiryTime,
          c: this.challenge,
        };
        this.dialogRef.close(response);
      }
    } else {
      // If dialog was not used to extend an applications time or change the challenge the just the number used to close will be returned
      this.dialogRef.close(state);
    }
  }
}
