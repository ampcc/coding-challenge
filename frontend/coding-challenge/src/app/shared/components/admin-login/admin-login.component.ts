import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    CommonModule,
  ]
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';

  usernameError: string = 'Error';
  passwordError: string = 'Error';

  showUsernameError: boolean = false;
  showPasswordError: boolean = false;

  // The Admin Login Component is used to log an admin in with his correct username and password
  constructor(private router: Router, private backendService: BackendService) { }

  // Tries to log the user in with username and password by calling the backend function
  login(username: string, password: string): void {
    this.showUsernameError = false;
    this.showPasswordError = false;
    // When username or password are empty, error messges appear underneath the empty text fields
    if (username == '' || password == '') {
      if (username == '') {
        this.usernameError = 'Please enter an username!';
        this.showUsernameError = true;
      }
      if (password == '') {
        this.passwordError = 'Please enter a password!';
        this.showPasswordError = true;
      }
    } else {
      // The backend is called to try and log the admin in
      // When the login is successful the user gets navigated to the applications page
      this.backendService.loginAdmin(username, password).subscribe((response) => {
        window.sessionStorage.setItem('Adm-Token', response.token);
        this.router.navigateByUrl("/admin_applications")
      }, (error: HttpErrorResponse) => {
        // If an error occurs error messages get displayed or the user gets redirected to one of the error pages, depending on the error code
        switch (error.status) {
          case 400:
            this.usernameError = 'Wrong username or password';
            this.showUsernameError = true;
            this.passwordError = 'Wrong username or password';
            this.showPasswordError = true;
            break;
          case 401:
            this.usernameError = 'Wrong username or password';
            this.showUsernameError = true;
            this.passwordError = 'Wrong username or password';
            this.showPasswordError = true;
            break;
          case 404:
            this.router.navigateByUrl("/notFound");
            break;
          default:
            this.router.navigateByUrl("/internalError");
            break;
        }
      });
    }
  }
}
