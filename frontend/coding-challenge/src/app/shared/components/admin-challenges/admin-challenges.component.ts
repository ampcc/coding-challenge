import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BackendService } from 'src/app/core/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Challenge } from '../../models/challenge';

@Component({
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
  ],
  selector: 'app-admin-challenges',
  templateUrl: './admin-challenges.component.html',
  styleUrls: ['./admin-challenges.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AdminChallengesComponent implements OnInit {
  private adminToken: string | null;

  public hideContentActiveChallenges = false;
  public hideFilterSelect = true;

  public challengeArray: Challenge[] = [];


  public constructor(private backend: BackendService, private router: Router, public dialog: MatDialog) {
    this.adminToken = null;
  }

  ngOnInit(): void {
    // Check if Admin Token is available
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    if (this.adminToken === null) {
      this.router.navigateByUrl("/admin_login");
    } else {
      this.backend.getChallenges(this.adminToken).subscribe((response: Challenge[]) => {
        response.forEach(element => {
          if (element.active) {
            this.challengeArray.push(element);
          }
        });
      });
    }
  }

  /**
   * Changes the tab and shows the associated content.
   * This also includes dynamically setting the style of the tabs
   * @param id The id tab-html element
   */
  public changeTab(id: string): void {
    const elementActiveChallenge = <HTMLLabelElement>document.getElementById('tabActiveChallenges');

    switch (id) {
      case 'tabActiveChallenges':
        this.hideContentActiveChallenges = false;

        elementActiveChallenge.setAttribute("style", "border-bottom: 2px solid black;");
        break;
    }
  }

  /**
   * Navigates the user to the designated page to add a challenge
   */
  public addChallenge(): void {
    this.router.navigateByUrl("/admin_edit_challenge");
  }

  /**
   * Opens a modal dialog that displays detailed information of the challenge.
   * On top of that, buttons for additional functionality are also displayed
   * @param challenge The challenge object of which information has to be shown
   */
  public openDialogActiveChallenges(challenge: Challenge): void {
    DialogComponent.name;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: challenge.challengeHeading,
        description: {
          details: challenge.challengeText
        },
        buttons: {
          left: { title: 'Edit', look: 'primary' },
          middle: { title: 'Delete', look: 'delete' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });

    // Checks which button was pressed on the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        // If the user wants to edit the challenge he gets navigated to the edit page
        this.router.navigateByUrl("/admin_edit_challenge?id=" + challenge.id);
      } else if (result == 2 && challenge.id != null) {
        // If user wants to delete a challenge another dialog opens
        this.openDeleteDialog(challenge);
      }
    });
  }


  /**
   * Opens another modal dialog that asks for confirmation to delete the challenge
   * @param challenge The challenge object which should be deleted
   */
  public openDeleteDialog(challenge: Challenge): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Are you sure you want to delete the Challenge?',
        buttons: {
          left: { title: 'Delete', look: 'delete' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });

    // If the dialog is closed and the result is 1 (the user decided to delete the challenge), the backend tries to delete the challenge
    // If this action was successful the challenge gets immediately deleted
    // Otherwise the user gets navigated to an error page depending on the error code
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1 && challenge.id) {
        this.backend.deleteChallenge(this.adminToken, challenge.id).subscribe((response) => {
          const index = this.challengeArray.findIndex(chal => chal.id === challenge.id);
          this.challengeArray.splice(index, 1);
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
    })
  }
}
