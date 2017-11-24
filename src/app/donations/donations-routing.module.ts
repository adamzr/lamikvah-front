import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { DonationsComponent } from './donations.component';

const routes: Routes = Route.withShell([
  { path: 'donations', component: DonationsComponent, data: { title: extract('Donations') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DonationsRoutingModule { }
