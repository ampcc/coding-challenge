import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  name: string = '';
  description: string = '';

  nameError: string = 'Error';
  descriptionError: string = 'Error';

  showNameError: boolean = false;
  showDescriptionError: boolean = false;

  constructor(private dialog: MatDialog, private router: Router, private backendService: BackendService) { }

  public ngOnInit(): void {
    // TODO: backend get challenge and enter in text fields

    this.name = 'Test';
    this.description = 'This is just a test to see if the text fields get filled in correctly';
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
      // TODO: edit Challenge in Backend based on information in name and description

      // If successful navigate back to Challenges
      this.router.navigate(['/admin_challenges']);
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
        // TODO: delete challenge in backend

        this.router.navigate(['/admin_challenges']);
      }
    })
  }

  cancel(): void {
    this.router.navigate(['/admin_challenges']);
  }
}
