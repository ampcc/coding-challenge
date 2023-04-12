import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './shared/components/start/start.component';
import { ChallengeComponent } from './shared/components/challenge/challenge.component';

const routes: Routes =
  [{ path: 'start', component: StartComponent },
  { path: 'challenge', component: ChallengeComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
