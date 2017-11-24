import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DonationsRoutingModule } from './donations-routing.module';
import { DonationsComponent } from './donations.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DonationsRoutingModule
  ],
  declarations: [
    DonationsComponent
  ]
})
export class DonationsModule { }
