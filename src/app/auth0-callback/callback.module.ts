import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CallbackRoutingModule,
    SharedModule
  ],
  declarations: [
    CallbackComponent
  ]
})
export class CallbackModule { }
