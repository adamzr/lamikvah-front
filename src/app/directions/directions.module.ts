import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectionsRoutingModule } from './directions-routing.module';
import { DirectionsComponent } from './directions.component';

@NgModule({
  imports: [
    CommonModule,
    DirectionsRoutingModule
  ],
  declarations: [
    DirectionsComponent
  ]
})
export class DirectionsModule { }
