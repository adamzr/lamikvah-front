import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationsRoutingModule } from './donations-routing.module';
import { DonationsComponent } from './donations.component';
import { FormsModule } from '@angular/forms';
import { DonationsService } from './donations.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DonationsRoutingModule
  ],
  declarations: [
    DonationsComponent
  ],
  providers: [
    DonationsService
  ]
})
export class DonationsModule { }
