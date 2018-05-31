import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { FaqComponent } from './faq.component';

const routes: Routes = Route.withShell([
  { path: 'faqs', component: FaqComponent, data: { title: 'FAQs'} }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FaqRoutingModule { }
