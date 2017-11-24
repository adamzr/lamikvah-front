import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { MensComponent } from './mens.component';

const routes: Routes = Route.withShell([
  { path: 'mens-mikvah', component: MensComponent, data: { title: extract('Mens') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MensRoutingModule { }
