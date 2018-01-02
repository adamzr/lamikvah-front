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

    if (this.authenticationService.isAuthenticated()) {
      if(state.url === "/profile"){
        return true;
      }
      let hasProfile = localStorage.getItem("hasProfile");
      if(hasProfile === "true"){
        return true;
      } else {
        console.log("User does not have a valid profile, redirecting them to the profile page from " + state.url);
        this.router.navigate(['/profile'], { replaceUrl: true });
        return false;
      }
    }

    return true;

  }

}
