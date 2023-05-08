import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from 'src/app/core/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Challenge } from '../../models/challenge';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css'],
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    CommonModule,
  ]
})
export class AdminEditComponent {
  private adminToken: string | null;
  name: string = '';
  description: string = '';
  id = 0;

  nameError: string = 'Error';
  descriptionError: string = 'Error';

  successMessage: string = 'added';
  pageName: string = 'Add';
  buttonTitle: string = 'Add Challenge';

  showNameError: boolean = false;
  showDescriptionError: boolean = false;

  successfulEdit: boolean = false;
  editPage: boolean = false;

  constructor(private dialog: MatDialog, private router: Router, private backendService: BackendService, private route: ActivatedRoute) {
    this.adminToken = null;
  }

  public ngOnInit(): void {
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    // if (this.adminToken === null) {
    //   this.router.navigateByUrl("/admin_login");
    // }
    this.route.queryParams.subscribe((params) => {
      // TODO: Check if this codeis correct and works
      if (params["id"] != null) {
        this.id = params["id"];
        this.editPage = true;
        this.successMessage = 'edited';
        this.pageName = 'Edit';
        this.buttonTitle = 'Confirm Changes';
      }
    });
    if (this.editPage) {
      this.backendService.getChallengeAdm(this.adminToken, this.id).subscribe((response) => {
        console.log(response)
        this.name = response.challengeHeading;
        this.description = response.challengeText;
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
  }

  // When name or description are empty, error messges appear underneath the text fields
  // Same applies, if name is shorter than 4 letters or description shorter than 20
  // Otherwise the backend is called to try and edit the challenge
  editChallenge(name: string, description: string): void {
    this.showNameError = false;
    this.showDescriptionError = false;
    if (name.length < 4 || description.length < 20) {
      if (name == '') {
        this.nameError = 'Please enter a challenge name!';
        this.showNameError = true;
      } else {
        this.nameError = 'Challenge name should include at least four characters!';
        this.showNameError = true;
      }
      if (description == '') {
        this.descriptionError = 'Please enter a challenge description!';
        this.showDescriptionError = true;
      } else {
        this.descriptionError = 'Challenge description should include at least 20 characters!';
        this.showDescriptionError = true;
      }
    } else {
      // TODO: Check if this codeis correct and works
      if (this.editPage) {
        var tempChallenge: Challenge = { id: this.id, challengeHeading: this.name, challengeText: this.description };
        this.backendService.editChallenge(this.adminToken, tempChallenge).subscribe((response) => {
          // If successful navigate back to Challenges
          this.successfulEdit = true;
          setTimeout(() => {
            this.router.navigate(['/admin_challenges']);
          }, 1500);
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
      } else {
        // TODO: Check if createChallenge works without id
        var tempChallenge: Challenge = { challengeHeading: this.name, challengeText: this.description };
        this.backendService.createChallenge(this.adminToken, tempChallenge).subscribe((response) => {
          // If successful navigate to Challenges
          this.successfulEdit = true;
          setTimeout(() => {
            this.router.navigate(['/admin_challenges']);
          }, 1500);
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
    }
  }

  deleteChallenge(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Are you sure you want to delete the Challenge?',
        buttons: {
          left: { title: 'Delete', look: 'delete' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
    });

    // If the dialog is closed and the result is true, the user decided to delete challenge, the backend deletes the challenge and the user is navigated to Challenges
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteChallenge(this.adminToken, this.id).subscribe(() => {
          this.router.navigate(['/admin_challenges']);
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

  cancel(): void {
    this.router.navigate(['/admin_challenges']);
  }
}
