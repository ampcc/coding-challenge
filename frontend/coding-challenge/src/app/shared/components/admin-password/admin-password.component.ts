import { Component, HostListener, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-password',
  templateUrl: './admin-password.component.html',
  styleUrls: ['./admin-password.component.css'],
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    CommonModule,
  ]
})
export class AdminPasswordComponent implements OnInit {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  private adminToken: string | null;

  oldPasswordError = 'Error';
  newPasswordError = 'Error';
  confirmPasswordError = 'Error';

  showOldPasswordError = false;
  showNewPasswordError = false;
  showConfirmPasswordError = false;

  successfulChange = false;

  // Listens for press of enter key and handles it as if confirm button was clicked
  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    let oldPassword = (document.getElementById("oldPassword") as HTMLInputElement).value;
    let newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
    let confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;
    this.setPassword(oldPassword, newPassword, confirmPassword);
  }

  // Reg Expression to check if password contains at least one uppercase and lowercase letter, as well as a number an special character
  mustContain = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])');

  // Admin Password Component can be accessed by the sidenavigation on admin pages
  // It is used to change an admins password
  constructor(private router: Router, public backendService: BackendService) {
    this.adminToken = null;
  }

  // Check for admin authentication token
  // If no admin token exists the user gets redirected to the admin login page
  ngOnInit(): void {
    this.adminToken = window.sessionStorage.getItem('Adm-Token');
    if (this.adminToken === null) {
      this.router.navigateByUrl("/admin_login")
    }
  }


  // It is also checked, if the old password and the confirm password are equal
  //In case all of the above factors are true the password gets changed and the user gets navigated to the applications page
  setPassword(oldP: string, newP: string, confirmP: string): void {
    this.showOldPasswordError = false;
    this.showNewPasswordError = false;
    this.showConfirmPasswordError = false;

    // If new password, old password, or confirm password are empty, error messages are shown underneath the corresponding empty text fields
    if (oldP == '' || newP == '' || confirmP == '') {
      if (oldP == '') {
        this.oldPasswordError = 'Please enter your old password!';
        this.showOldPasswordError = true;
      }
      if (newP == '') {
        this.newPasswordError = 'Please enter a new password!';
        this.showNewPasswordError = true;
      }
      if (confirmP == '') {
        this.confirmPasswordError = 'Please confirm your new password by entering it here!';
        this.showConfirmPasswordError = true;
      }
    } else {

      // Otherwise it is checked, if the new password is at least eight letters long
      // If that is not the case, an error message gets displayed
      if (newP.length < 8) {
        this.newPasswordError = 'Password must contain at least eight characters!';
        this.showNewPasswordError = true;

        // If so, it is also checked if the password contains the predefined RegExp
        // If it does not another error message is shown
      } else if (!this.mustContain.test(newP)) {
        this.newPasswordError = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!';
        this.showNewPasswordError = true;

        // If the new password is not the same as the confirm password an error message also displayed
      } else if (newP != confirmP) {
        this.newPasswordError = 'Passwords do not match. Please try again!';
        this.confirmPasswordError = 'Passwords do not match. Please try again!';
        this.showNewPasswordError = true;
        this.showConfirmPasswordError = true;

        // Otherwise no errors were made when entering the new password
        // Threfore the backend gets called and tries to change the users password
        // If the change is successful the page shows positive feedback before navigating to the applications page
        // Otherwise an error message gets displayed or the user is redirected to an error page
      } else {
        this.backendService.changePassword(this.adminToken, oldP, newP).subscribe((response) => {
          this.successfulChange = true;
          setTimeout(() => {
            this.router.navigate(['/admin_applications']);
          }, 1500);
        }, (error: HttpErrorResponse) => {
          switch (error.status) {
            case 401:
              window.sessionStorage.clear();
              this.router.navigateByUrl("/unauthorized");
              break;
            case 403:
              this.oldPasswordError = 'Wrong password. Please try again!';
              this.showOldPasswordError = true;
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

  // In case the user decides not to change his password he can cancel the action and gets navigated to the applications page
  cancel(): void {
    this.router.navigate(['/admin_applications']);
  }
}
