import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MembershipRoutingModule } from './membership-routing.module';
import { MembershipComponent } from './membership.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MembershipRoutingModule
  ],
  declarations: [
    MembershipComponent
  ]
})
export class MembershipModule { }
