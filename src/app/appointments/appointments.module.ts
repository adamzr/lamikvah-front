import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsService } from './appointments.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppointmentsRoutingModule
  ],
  declarations: [
    AppointmentsComponent
  ],
  providers: [
    AppointmentsService
  ]
})
export class AppointmentsModule { }
