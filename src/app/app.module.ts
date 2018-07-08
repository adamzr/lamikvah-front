import { BrowserModule } from '@angular/platform-browser';
import {
  Injectable,
  Injector,
  InjectionToken,
  NgModule,
  ErrorHandler
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthenticationService } from './core/authentication/authentication.service';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import * as Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: '7084372e84204614bd910b214fe038ff',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(err:any) : void {
    var rollbar = this.injector.get(RollbarService);
    rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
    return new Rollbar(rollbarConfig);
}

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    AppRoutingModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  declarations: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(public auth: AuthenticationService) {
    auth.scheduleRenewal();
  }

}
