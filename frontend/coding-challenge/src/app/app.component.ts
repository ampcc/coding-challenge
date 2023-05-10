import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { BackendService } from 'src/app/core/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'coding-challenge';
  adminPage = false;
  sitenavClosed = true;
  adminApplicants = false;
  adminChallenges = false;
  adminPassword = false;
  link = '/start';

  // Check whether the logout button and sitenavigation should be displayed
  constructor(private dialog: MatDialog, private backendService: BackendService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.adminPage = false;
        this.adminApplicants = false;
        this.adminChallenges = false;
        this.adminPassword = false;
        if (event.url.includes('admin')) {
          this.link = '/admin_login';
          if (!event.url.includes('login')) {
            this.adminPage = true;
            this.link = '/admin_applications';

            if (event.url.includes('applications')) {
              this.adminApplicants = true;
            } else if (event.url.includes('challenges')) {
              this.adminChallenges = true;
            } else if (event.url.includes('password')) {
              this.adminPassword = true;
            }
          }
        }
      }
    })
  }

  // Show Dialog to ask the admin to confirm that he wants to log out
  logout(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Are you sure you want to log out?',
        buttons: {
          left: { title: 'Log out', look: 'primary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
      maxHeight: '85vh',
      minWidth: '30vw',
    });

    // If the user confirmed the logout, he gets navigated to the login page
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.sessionStorage.clear();
        this.router.navigate(['/admin_login']);
      }
    })
  }

  // Sitenavigation gets opened
  openSitenav(): void {
    this.sitenavClosed = false;
  }

  // Sitenavigation gets closed
  closeSitenav(): void {
    this.sitenavClosed = true;
  }
}
