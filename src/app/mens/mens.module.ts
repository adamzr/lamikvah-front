import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MensRoutingModule } from './mens-routing.module';
import { MensComponent } from './mens.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MensRoutingModule
  ],
  declarations: [
    MensComponent
  ]
})
export class MensModule { }
