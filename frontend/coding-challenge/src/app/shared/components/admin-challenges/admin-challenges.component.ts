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
  challenge: Challenge;
  private adminToken: string | null;

  public hideContentActiveChallenges: boolean = false;

  public hideFilterSelect: boolean = true;

  public challengeArray: Challenge[] = [{ id: 0, challengeHeading: 'Challenge0', challengeText: 'rtulip68o5ezrthsgfehjzr7ik4k6ujzhrtbfdv hf,kzujtzrgrhtj' },
  { id: 1, challengeHeading: 'Challenge1', challengeText: 'bgdnhmjzk,uzjthrf ngjmzik6u75z6tgrfvd fhtjm,il6izjtuegfwdc fdgnhmt,il' }
  ];


  public constructor(private backend: BackendService, private router: Router, public dialog: MatDialog) {
    this.challenge = { id: 0, challengeHeading: '', challengeText: '' };
    this.adminToken = null;
  }

  ngOnInit(): void {
    // Check if Admin Token is available
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    if (this.adminToken === null) {
      this.router.navigateByUrl("/admin_login")
    } else {
      this.backend.getChallenges(this.adminToken).subscribe((response: Challenge[]) => {
        this.challengeArray = response;
      });
    }
  }

  public changeTab(id: string): void {
    let elementActiveChallenge = <HTMLLabelElement>document.getElementById('tab_active_challenges');
    let elementArchive = <HTMLLabelElement>document.getElementById('tab_archiv');

    switch (id) {
      case 'tab_active_challenges':
        this.hideContentActiveChallenges = false;

        elementActiveChallenge.setAttribute("style", "border-bottom: 2px solid black;");
        elementArchive.setAttribute("style", "border-bottom: none;");
        break;
    }
  }

  public addChallenge(): void {
    this.router.navigateByUrl("/admin_edit_challenge");
  }


  // public showFilter(): void {
  //   this.hideFilterSelect = !this.hideFilterSelect;
  // }

  // public toggleTreeView(id: string): void {
  //   let element = document.getElementById(id);
  //   if(element !== null && element !== undefined) {
  //     let parentElement = element.parentElement;

  //     if(parentElement !== null && parentElement !== undefined) {
  //       parentElement.querySelector(".nested")!.classList.toggle("active");
  //       element.classList.toggle("caret-down");
  //     }
  //   }
  // }

  // public checkboxChallengeChange(): void {

  // }


  public openDialogActiveChallenges(challenge: Challenge): void {
    DialogComponent.name;
    let dialogRef = this.dialog.open(DialogComponent, {
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

  // If a user decided to delete a challenge another dialog opens to ask for a second confirmation
  public openDeleteDialog(challenge: Challenge): void {
    let dialogRef = this.dialog.open(DialogComponent, {
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
      if (result == 1) {
        this.backend.deleteChallenge(this.adminToken, challenge.id!).subscribe(() => {
          var index = this.challengeArray.findIndex(chal => chal.id === challenge.id);
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
