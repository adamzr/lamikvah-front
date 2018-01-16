import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DonationsRoutingModule } from './donations-routing.module';
import { DonationsComponent } from './donations.component';
import { FormsModule } from '@angular/forms';
import { DonationsService } from './donations.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
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
