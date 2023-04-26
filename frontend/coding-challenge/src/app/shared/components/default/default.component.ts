import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/core/backend.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit{
  private key: string;

  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router){
    this.key = "";
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.key = params["key"];
      window.sessionStorage.clear();
    });
    this.backendService.loginWithAppKey(this.key).subscribe(data => {
      console.log(data);
      window.sessionStorage.setItem('Auth-Token', data.token);
      this.router.navigateByUrl("/start");
    },(error: HttpErrorResponse) => {
      switch(error.status){
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
