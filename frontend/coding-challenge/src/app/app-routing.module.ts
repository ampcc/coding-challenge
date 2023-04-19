import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './shared/components/admin/admin.component';
import { ChallengeComponent } from './shared/components/challenge/challenge.component';

const routes: Routes = [{
  path: 'admin', component: AdminComponent},
  {path: 'challenge', component: ChallengeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
