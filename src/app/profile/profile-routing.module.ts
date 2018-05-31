import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { ProfileComponent } from './profile.component';

const routes: Routes = Route.withShell([
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile'} }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProfileRoutingModule { }
