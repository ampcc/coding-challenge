import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/core/backend.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  private key: string;

  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router) {
    this.key = "";
  }

  // Navigates back to start page after login an apllicant in with his key
  // If an error occurs the user instead gets navigated to one of the error pages
  ngOnInit() {
    window.sessionStorage.clear();
    this.key = this.router.url.substring(13);
    this.key = decodeURIComponent(this.key);
    this.backendService.loginWithAppKey(this.key).subscribe(data => {
      console.log(data);
      window.sessionStorage.setItem('Auth-Token', data.token);
      this.router.navigateByUrl("/start");
    }, (error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          this.router.navigateByUrl("/unauthorized");
          break;
        case 404:
          this.router.navigateByUrl("/notFound");
          break;
        case 410:
          this.router.navigateByUrl("/gone");
          break;
        default:
          this.router.navigateByUrl("/internalError");
          break;
      }
    });
  }

}
