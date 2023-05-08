import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule
  ]
})
export class DialogComponent {
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
    },
    images: [string],
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

  //The Dialog can be closed with the press of a button
  public closeDialog(state: number) {
    this.dialogRef.close(state);
  }
}
