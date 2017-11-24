import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MembershipModule } from './membership/membership.module';
import { FaqModule } from './faq/faq.module';
import { CallbackModule } from './auth0-callback/callback.module';
import { DirectionsModule } from './directions/directions.module';
import { DonationsModule } from './donations/donations.module';
import { MensModule } from './mens/mens.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    CoreModule,
    SharedModule,
    HomeModule,
    ProfileModule,
    MembershipModule,
    AppointmentsModule,
    FaqModule,
    DirectionsModule,
    DonationsModule,
    MensModule,
    CallbackModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
