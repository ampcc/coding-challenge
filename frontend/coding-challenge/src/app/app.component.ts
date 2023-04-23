import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { Router, NavigationEnd } from '@angular/router';
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

  constructor(private dialog: MatDialog, private backendService: BackendService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
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

  logout(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Are you sure you want to log out?',
        buttons: {
          left: { title: 'Log out', look: 'primary' },
          right: { title: 'Cancel', look: 'secondary' }
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Logout for admin

        this.router.navigate(['/admin_login']);
      }
    })
  }

  openSitenav(): void {
    this.sitenavClosed = false;
  }

  closeSitenav(): void {
    this.sitenavClosed = true;
  }
}
