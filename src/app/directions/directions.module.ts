import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DirectionsRoutingModule } from './directions-routing.module';
import { DirectionsComponent } from './directions.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DirectionsRoutingModule
  ],
  declarations: [
    DirectionsComponent
  ]
})
export class DirectionsModule { }
