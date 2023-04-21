import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BackendService } from 'src/app/core/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'coding-challenge';
  showLogout = false;

  constructor(private backendService: BackendService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('admin') && !event.url.includes('login')) {
          this.showLogout = true;
        }
      }
    })
  }

  logout(): void {
    // TODO: Logout for admin
  }
}
