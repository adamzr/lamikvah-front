import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MembershipRoutingModule } from './membership-routing.module';
import { MembershipComponent } from './membership.component';
import { FormsModule } from '@angular/forms';
import { MembershipService } from './membership.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MembershipRoutingModule
  ],
  declarations: [
    MembershipComponent
  ],
  providers: [
    MembershipService
  ]
})
export class MembershipModule { }
