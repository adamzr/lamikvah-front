import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MensRoutingModule } from './mens-routing.module';
import { MensComponent } from './mens.component';

@NgModule({
  imports: [
    CommonModule,
    MensRoutingModule
  ],
  declarations: [
    MensComponent
  ]
})
export class MensModule { }
