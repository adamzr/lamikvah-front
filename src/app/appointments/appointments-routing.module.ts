import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { AppointmentsComponent } from './appointments.component';

const routes: Routes = Route.withShell([
  { path: 'appointments', component: AppointmentsComponent, data: { title: extract('Appointments') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppointmentsRoutingModule { }
