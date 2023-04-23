import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  standalone: true,
  imports: [ButtonComponent]
})

export class StartComponent {
  constructor(private dialog: MatDialog, private router: Router, private backendService: BackendService) { }

  // Dialog to ask the user to confirm that he wants to start the challenge gets displayed
  openDialog(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Start Coding Challenge',
        description: {
          important: 'Are you sure you want to start the Coding Challenge?',
          details: 'Since receiving our mail you have a period of ten days to start the Challenge. <br>Once you have done so, you have three days to upload your solution.'
        },
        buttons: {
          left: { title: 'Start Coding Challenge', look: 'primary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
    });

    // If the dialog is closed and the result is true, the user decided to start the challenge, the backend starts the challenge and the user is navigated to the challenge page
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Real Applicant from URL
        this.backendService.startChallenge("test");
        console.log("Challenge has been started by test");

        this.router.navigate(['/challenge']);
      }
    })
  }

}