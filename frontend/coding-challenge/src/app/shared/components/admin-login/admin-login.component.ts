import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private backendService: BackendService) { }

  login(username: string, password: string): void {
    this.showUsernameError = false;
    this.showPasswordError = false;
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
      this.backendService.loginAdmin(username, password);

      // TODO: Validate response instead
      const d = new Date();
      let m = d.getMinutes();

      if ((m % 2) == 1) {
        this.usernameError = 'Wrong login initials. Please try again!';
        this.passwordError = 'Wrong login initials. Please try again!';
        this.showUsernameError = true;
        this.showPasswordError = true;
      } else {
        this.router.navigate(['/admin_applications']);
      }
    }
  }
}
