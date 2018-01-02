import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as auth0 from 'auth0-js';

import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserService } from '../../profile/user.service';

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

  private _credentials: Credentials;

  auth0 = new auth0.WebAuth({
    clientID: 'a5SWVJAk9yYGKbnXqBJBQY7osDwOpfhB',
    domain: 'mikvah.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.mikvahla.org',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile create:appointments'
  });

  constructor(public router: Router, public userService: UserService) {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.userService.getUser().subscribe(user => {
          if(user.firstName || user.lastName){
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

}
