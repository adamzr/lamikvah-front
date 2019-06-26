import { BrowserModule } from '@angular/platform-browser';
import {
  Injectable,
  InjectionToken,
  NgModule,
  ErrorHandler,
  Inject
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

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err:any) : void {
    this.rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
    const rollbar = new Rollbar(rollbarConfig);
    (<any>window).rollbar = rollbar;
    return rollbar;
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
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
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(public auth: AuthenticationService) {
    auth.scheduleRenewal();
  }

}
