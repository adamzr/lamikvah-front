import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Logger } from '../logger.service';
import { AuthenticationService } from './authentication.service';

const log = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    log.debug("Going to ", state);

    if(state.url === "/about"){
      if (this.authenticationService.isAuthenticated()) {
        return true;
      }

      log.debug('Not authenticated, redirecting...');
      this.authenticationService.login();
      return false;
    }
    return true;
    // if (this.authenticationService.isAuthenticated()) {
    //   return true;
    // }
    //
    // log.debug('Not authenticated, redirecting...');
    // this.authenticationService.login();
    // //this.router.navigate(['/login'], { replaceUrl: true });
    // return false;
  }

}
