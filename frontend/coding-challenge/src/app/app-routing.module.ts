import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './shared/components/admin/admin.component';
import { ChallengeComponent } from './shared/components/challenge/challenge.component';
import { StartComponent } from './shared/components/start/start.component';
import { AdminLoginComponent } from './shared/components/admin-login/admin-login.component';
import { AdminApplicationsComponent } from './shared/components/admin-applications/admin-applications.component';
import { AdminChallengesComponent } from './shared/components/admin-challenges/admin-challenges.component';
import { AdminPasswordComponent } from './shared/components/admin-password/admin-password.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'challenge', component: ChallengeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  { path: 'admin_applications', component: AdminApplicationsComponent },
  { path: 'admin_challenges', component: AdminChallengesComponent },
  { path: 'admin_password', component: AdminPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
