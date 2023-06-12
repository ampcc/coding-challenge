import { Component, HostListener } from '@angular/core';
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

  name = '';
  description = '';
  id = 0;

  nameError = 'Error';
  descriptionError = 'Error';

  successMessage = 'added';
  pageName = 'Add';
  buttonTitle = 'Add Challenge';

  showNameError = false;
  showDescriptionError = false;

  successfulEdit = false;
  editPage = false;

  // Listens for press of enter key and handles it as if confirm button was clicked
  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLInputElement).value;
    this.editChallenge(name, description);
  }

  // The Admin Edit Component can either be used to edit an existing challenge or to create a new one
  constructor(private dialog: MatDialog, private router: Router, public backendService: BackendService, private route: ActivatedRoute) {
    this.adminToken = null;
  }

  // Checks for the admin authentication token
  // If no admin token exists the user gets redirected to the admin login page
  public ngOnInit(): void {
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    if (this.adminToken === null) {
      this.router.navigateByUrl("/admin_login");
    }

    // Checks if query parameter id exists
    // If so the variables get prepared to displaye the page as edit challenge page
    // Otherwise it is displayed as add challenge page
    this.route.queryParams.subscribe((params) => {
      if (params["id"] != null) {
        this.id = params["id"];
        this.editPage = true;
        this.successMessage = 'edited';
        this.pageName = 'Edit';
        this.buttonTitle = 'Confirm Changes';
      }
    });
    // If the page is used to edit a challenge, it gets called by the backend
    // If the call was successful the text fields get filled with the preset values
    // Otherwise the user gets redirected to an error page depending on the given error message
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

  // Edits or creates a challenge with the given inputs
  editChallenge(name: string, description: string): void {
    this.showNameError = false;
    this.showDescriptionError = false;
    // When name or description are empty, error messges appear underneath the empty text fields
    // Same applies, if name is shorter than 4 letters or description shorter than 20
    if (name.length < 4 || description.length < 20) {
      if (name == '') {
        this.nameError = 'Please enter a challenge name!';
        this.showNameError = true;
      } else if (name.length < 4) {
        this.nameError = 'Challenge name should include at least four characters!';
        this.showNameError = true;
      }
      if (description == '') {
        this.descriptionError = 'Please enter a challenge description!';
        this.showDescriptionError = true;
      } else if (description.length < 20) {
        this.descriptionError = 'Challenge description should include at least 20 characters!';
        this.showDescriptionError = true;
      }
    } else {

      // If the page is an edit page the backend is called to edit the challenge using the users input
      // If the changes are successful the user gets positive feedback and then is navigated to the challenges page
      // Otherwise the user gets navigated to an error page
      if (this.editPage) {
        const tempChallenge: Challenge = { id: this.id, challengeHeading: this.name, challengeText: this.description, active: true };
        this.backendService.editChallenge(this.adminToken, tempChallenge).subscribe((response) => {
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
        // If the page is an add challenge page the backend is calledto create a new challenge
        // If the creation is successful the user gets positive feedback and then is navigated to the challenges page
        // Otherwise the user gets navigated to an error page
        const tempChallenge: Challenge = { challengeHeading: this.name, challengeText: this.description, active: true };
        this.backendService.createChallenge(this.adminToken, tempChallenge).subscribe((response) => {
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

  // A dialog is opened to ask the user for confirmation that he wants to delete the challenge
  deleteChallenge(): void {
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

    // If the dialog is closed and the result is 1 (the user decided to delete challenge), the backend tries to delete the challenge
    // If that is successful the user gets redircted to the challenges page
    // Otherwise the user gets navigated to an error page depending on the given error code
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.backendService.deleteChallenge(this.adminToken, this.id).subscribe((response) => {
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

  // If the user cancels the action h gets navigated to the chllenges page without any changes made to any challenge
  cancel(): void {
    this.router.navigate(['/admin_challenges']);
  }
}
