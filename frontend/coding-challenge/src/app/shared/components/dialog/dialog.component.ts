import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [ButtonComponent, NgIf]
})
export class DialogComponent {
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
    buttons: {
      left: {
        title: string,
        look: string
      },
      right: {
        title: string,
        look: string
      }
    }
  },
    public dialogRef: MatDialogRef<DialogComponent>) { }

  //The Dialog can be closed with the press of a button
  public closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }
}
