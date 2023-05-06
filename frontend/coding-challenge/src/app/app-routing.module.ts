import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './shared/components/admin/admin.component';
import { ChallengeComponent } from './shared/components/challenge/challenge.component';
import { StartComponent } from './shared/components/start/start.component';
import { AdminLoginComponent } from './shared/components/admin-login/admin-login.component';
import { AdminApplicationsComponent } from './shared/components/admin-applications/admin-applications.component';
import { AdminChallengesComponent } from './shared/components/admin-challenges/admin-challenges.component';
import { AdminPasswordComponent } from './shared/components/admin-password/admin-password.component';
import { AdminEditComponent } from './shared/components/admin-edit/admin-edit.component';
import { DefaultComponent } from './shared/components/default/default.component';
import { ForbiddenComponent } from './shared/components/errors/forbidden/forbidden.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { GoneComponent } from './shared/components/errors/gone/gone.component';
import { UnauthorizedComponent } from './shared/components/errors/unauthorized/unauthorized.component';
import { InternalErrorComponent } from './shared/components/errors/internal-error/internal-error.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'challenge', component: ChallengeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  { path: 'admin_applications', component: AdminApplicationsComponent },
  { path: 'admin_challenges', component: AdminChallengesComponent },
  { path: 'admin_password', component: AdminPasswordComponent },
  { path: 'admin_edit_challenge', component: AdminEditComponent },
  { path: 'application', component: DefaultComponent },
  { path: 'application/:key', component: DefaultComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'notFound', component: NotFoundComponent },
  { path: 'gone', component: GoneComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'internalError', component: InternalErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
