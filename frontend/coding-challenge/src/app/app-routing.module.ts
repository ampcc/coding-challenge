import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './shared/components/admin/admin.component';
import { ChallengeComponent } from './shared/components/challenge/challenge.component';
import { StartComponent } from './shared/components/start/start.component';
import { ChallengeComponent } from './shared/components/challenge/challenge.component';

const routes: Routes =
  [{ path: 'start', component: StartComponent },
  { path: 'challenge', component: ChallengeComponent }{
  path: 'admin', component: AdminComponent},
  {path: 'challenge', component: ChallengeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
