import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { MembershipComponent } from './membership.component';

const routes: Routes = Route.withShell([
  { path: 'fees-and-membership', component: MembershipComponent, data: { title: 'Fees and Membership' } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MembershipRoutingModule { }
