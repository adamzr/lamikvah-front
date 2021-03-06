import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembershipRoutingModule } from './membership-routing.module';
import { MembershipComponent } from './membership.component';
import { FormsModule } from '@angular/forms';
import { MembershipService } from './membership.service';

@NgModule({
  imports: [
    CommonModule,
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
