import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { DirectionsComponent } from './directions.component';

const routes: Routes = Route.withShell([
  { path: 'directions', component: DirectionsComponent, data: { title: extract('Directions') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DirectionsRoutingModule { }
