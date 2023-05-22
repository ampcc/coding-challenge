import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  standalone: true,
  imports: [ButtonComponent]
})

// Start component is used when applicant first opens his unique link
// He is then prompted to start the coding challenge on the click of a button
// After the button is pressed a dialog shows up to ask the user for another confirmation to start the challenge
export class StartComponent implements OnInit {
  private applicationToken: string | null;

  constructor(private dialog: MatDialog, private router: Router, private backendService: BackendService) {
    this.applicationToken = null;
  }

  // Check for proper authentication token
  // If no token is provided the user gets redirected to the unauthorized page
  ngOnInit(): void {
    this.applicationToken = window.sessionStorage.getItem('Auth-Token');
    if (this.applicationToken === null) {
      this.router.navigateByUrl("/unauthorized")
    } else {
      // If the user already started the challenge he gets redirected to the challenge page
      // If the user already uploaded his solution he instead gets redirected to the gone page
      this.backendService.getStatus(this.applicationToken).subscribe((response) => {
        if (response.status === 1) {
          this.router.navigateByUrl("/challenge");
        } else if (response.status >= 2) {
          window.sessionStorage.clear();
          this.router.navigateByUrl("/gone");
        }
      });
    }
  }

  // Tries to start the challenge by calling the corresponding backend function with the useres authentication token
  // Only when this is successful the user gets navigated to the challenge page
  // If an error occurs the user gets redirected to one of the error pages, depending on the error code
  tryToStartChallenge() {
    this.backendService.startChallenge(this.applicationToken).subscribe((data) => {
      console.log(data);
      this.router.navigateByUrl("/challenge");
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
        case 410:
          window.sessionStorage.clear();
          this.router.navigateByUrl("/gone");
          break;
        default:
          window.sessionStorage.clear();
          this.router.navigateByUrl("/internalError");
          break;
      }
    });
  }

  // Opens dialog to ask the user for confirmation to start the challenge
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
      maxHeight: '85vh',
      minWidth: '30vw',
    });

    // Checkss if the dialog is closed and the result is 1 (the user decided to start the challenge)
    // In that case the backend tries to start the challenge
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.tryToStartChallenge();
      }
    })
  }
}
