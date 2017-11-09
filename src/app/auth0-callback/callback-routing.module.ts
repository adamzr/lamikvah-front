import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { CallbackComponent } from './callback.component'

const routes: Routes = Route.withShell([
  { path: 'callback', component: CallbackComponent, data: { title: extract('Logging In...') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CallbackRoutingModule { }
