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

  username_error: string = 'Error';
  password_error: string = 'Error';

  show_username_error: boolean = false;
  show_password_error: boolean = false;

  constructor(private router: Router, private backendService: BackendService) { }

  setValue(): void {

  }

  login(username: string, password: string): void {
    this.show_username_error = false;
    this.show_password_error = false;
    if (username == '' || password == '') {
      if (username == '') {
        this.username_error = 'Please enter an username!';
        this.show_username_error = true;
      }
      if (password == '') {
        this.password_error = 'Please enter a password!';
        this.show_password_error = true;
      }
    } else {
      this.backendService.loginAdmin(username, password);

      // TODO: Validate response instead
      const d = new Date();
      let m = d.getMinutes();

      if ((m % 2) == 1) {
        this.username_error = 'Wrong login initials. Please try again!';
        this.password_error = 'Wrong login initials. Please try again!';
        this.show_username_error = true;
        this.show_password_error = true;
      } else {
        this.router.navigate(['/admin_applications']);
      }
    }
  }
}
