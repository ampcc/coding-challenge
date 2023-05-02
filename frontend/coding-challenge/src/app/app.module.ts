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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnauthorizedComponent } from './shared/components/errors/unauthorized/unauthorized.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { GoneComponent } from './shared/components/errors/gone/gone.component';
import { InternalErrorComponent } from './shared/components/errors/internal-error/internal-error.component';
import { ForbiddenComponent } from './shared/components/errors/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    AdminChallengesComponent,
    AdminEditComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    GoneComponent,
    InternalErrorComponent,
    ForbiddenComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    AdminLoginComponent,
    AdminPasswordComponent,
    AdminApplicationsComponent,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
