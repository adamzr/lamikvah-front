import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    UserService
  ]
})
export class ProfileModule { }
