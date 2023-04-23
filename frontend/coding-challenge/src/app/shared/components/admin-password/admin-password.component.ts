import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
export class AdminPasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  oldPasswordError: string = 'Error';
  newPasswordError: string = 'Error';
  confirmPasswordError: string = 'Error';

  showOldPasswordError: boolean = false;
  showNewPasswordError: boolean = false;
  showConfirmPasswordError: boolean = false;

  mustContain = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])');

  constructor(private router: Router, private backendService: BackendService) { }

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
      const d = new Date();
      let m = d.getMinutes();
      // TODO: Check if old password is correct, if so continue 
      if ((m % 2) == 1) {
        this.oldPasswordError = 'Wrong password. Please try again!';
        this.showOldPasswordError = true;
      }
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
        // TODO: Set new password for admin
        this.router.navigate(['/admin_applications']);
      }

    }
  }

  cancel(): void {
    this.router.navigate(['/admin_applications']);
  }
}
