import { Component, OnInit } from '@angular/core';
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
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  private adminToken: string | null;

  oldPasswordError: string = 'Error';
  newPasswordError: string = 'Error';
  confirmPasswordError: string = 'Error';

  showOldPasswordError: boolean = false;
  showNewPasswordError: boolean = false;
  showConfirmPasswordError: boolean = false;

  mustContain = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])');

  constructor(private router: Router, private backendService: BackendService) {
    this.adminToken = null;
  }

ngOnInit(): void {
  this.adminToken = window.sessionStorage.getItem('Adm-Token');
  if(this.adminToken === null){
    this.router.navigateByUrl("/admin_login")
  }
}

  // If new password, old password, or confirm password are empty, error messages are shown underneath the corresponding text fields
  // Otherwise it is checked, whether the old password is correct and whether the new password contains at least eight letters including at least one uppercase letter, one lowercase letter, one number, and one special character
  // It is also checked, if the old password and the confirm password are equal
  //In case all of the above factors are true the password gets changed and the user gets navigated to the applications page
  setPassword(oldP: string, newP: string, confirmP: string): void {
    this.showOldPasswordError = false;
    this.showNewPasswordError = false;
    this.showConfirmPasswordError = false;
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
      if (newP.length < 8) {
        this.newPasswordError = 'Password must contain at least eight characters!';
        this.showNewPasswordError = true;
      } else if (!this.mustContain.test(newP)) {
        this.newPasswordError = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!';
        this.showNewPasswordError = true;
      } else if (newP != confirmP) {
        this.newPasswordError = 'Passwords do not match. Please try again!';
        this.confirmPasswordError = 'Passwords do not match. Please try again!';
        this.showNewPasswordError = true;
        this.showConfirmPasswordError = true;
      } else {
        this.backendService.changePassword(this.adminToken, oldP, newP).subscribe((response) => {
          this.router.navigate(['/admin_applications']);
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

  // In case the user decides not to change the password he can cancel and gets navigated to the applications page
  cancel(): void {
    this.router.navigate(['/admin_applications']);
  }
}
