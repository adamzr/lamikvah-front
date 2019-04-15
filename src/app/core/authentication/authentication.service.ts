import { Injectable, Inject } from '@angular/core';
import { Subscription, of, timer} from 'rxjs';
import { flatMap } from 'rxjs/operators';

import * as auth0 from 'auth0-js';

import { Router } from '@angular/router';

import { UserService } from '../../profile/user.service';

import { environment } from '../../../environments/environment';

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private requestedScopes: string = 'openid profile create:appointments';

  private _credentials: Credentials;

  private refreshSubscription: Subscription;

  auth0 = new auth0.WebAuth({
    clientID: 'a5SWVJAk9yYGKbnXqBJBQY7osDwOpfhB',
    domain: 'mikvah.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.mikvahla.org',
    redirectUri: environment.callbackUrl,
    scope: this.requestedScopes
  });

  constructor(public router: Router, public userService: UserService) {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    // const rollbar = this.injector.get(RollbarService);
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.userService.getUser().subscribe(user => {
          if(user.firstName || user.lastName){
            (<any>window).rollbar.configure({
              payload: {
                id: user.id,
                username: user.email,
                email: user.email
              }
            });
            localStorage.setItem("hasProfile", "true");
            this.router.navigate(['/appointments']);
          } else {
            localStorage.setItem("hasProfile", "false");
            this.router.navigate(['/profile']);
          }
        })
        
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.scheduleRenewal();

    const scopes = authResult.scope || this.requestedScopes || '';
    localStorage.setItem('scopes', JSON.stringify(scopes));
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.clear();
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public userHasScopes(scopes: Array<string>): boolean {
    const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }

  public renewToken() {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setSession(result);
      }
    });
  }

  public scheduleRenewal() {
    if(!this.isAuthenticated()) return;
    this.unscheduleRenewal();
  
    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
  
    const source = of(expiresAt).pipe(flatMap(
      expiresAt => {
  
        const now = Date.now();
  
        // Use the delay in a timer to
        // run the refresh at the proper time
        return timer(Math.max(1, expiresAt - now));
      }));
  
    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSubscription = source.subscribe(() => {
      this.renewToken();
      this.scheduleRenewal();
    });
  }
  
  public unscheduleRenewal() {
    if(!this.refreshSubscription) return;
    this.refreshSubscription.unsubscribe();
  }

}
