import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';

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
  // adminEdit = false;
  link = '/start';

  // Check whether the logout button and sitenavigation should be displayed and which link should be set for the amplimind logo
  // When user is on an admin page it should be except if that admin page is the login page
  constructor(private dialog: MatDialog, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // To avoid displaying the navigation and logout button when the user has just logged out, the variables are set to false on default
        this.adminPage = false;
        this.adminApplicants = false;
        this.adminChallenges = false;
        this.adminPassword = false;
        // this.adminEdit = false;

        // Here is the check, if the current page is an admin page
        if (event.url.includes('admin')) {
          this.link = '/admin_login';
          if (!event.url.includes('login')) {
            this.adminPage = true;
            this.link = '/admin_applications';

            // This check is used to determine which sidenav link has to be marked as opened
            if (event.url.includes('applications')) {
              this.adminApplicants = true;
            } else if (event.url.includes('challenges')) {
              this.adminChallenges = true;
            } else if (event.url.includes('password')) {
              this.adminPassword = true;
              // } else if (event.url.includes('edit')) {
              //   this.adminEdit = true;
            }
          }
        } else {
          this.link = '/start';
        }
      }
    })
  }

  // Show Dialog to ask the admin to confirm that he wants to log out
  logout(): void {
    if (this.adminPage) {
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

      // If the user confirmed the logout, he gets navigated to the admin login page
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          window.sessionStorage.clear();
          this.router.navigate(['/admin_login']);
        }
      })
    }
  }

  // Sitenavigation gets displayed
  openSitenav(): void {
    if (this.adminPage) {
      this.sitenavClosed = false;
    }
  }

  // Sitenavigation gets closed
  closeSitenav(): void {
    this.sitenavClosed = true;
  }
}
