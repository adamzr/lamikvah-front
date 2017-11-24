import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AppointmentsRoutingModule
  ],
  declarations: [
    AppointmentsComponent
  ]
})
export class AppointmentsModule { }
