import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback.component';

@NgModule({
  imports: [
    CommonModule,
    CallbackRoutingModule,
    SharedModule
  ],
  declarations: [
    CallbackComponent
  ]
})
export class CallbackModule { }
