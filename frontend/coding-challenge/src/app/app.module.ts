import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultComponent } from './shared/components/default/default.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminLoginComponent } from './shared/components/admin-login/admin-login.component';
import { AdminApplicationsComponent } from './shared/components/admin-applications/admin-applications.component';
import { AdminChallengesComponent } from './shared/components/admin-challenges/admin-challenges.component';
import { AdminPasswordComponent } from './shared/components/admin-password/admin-password.component';
import { AdminEditComponent } from './shared/components/admin-edit/admin-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    AdminApplicationsComponent,
    AdminChallengesComponent,
    AdminEditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    AdminLoginComponent,
    AdminPasswordComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
