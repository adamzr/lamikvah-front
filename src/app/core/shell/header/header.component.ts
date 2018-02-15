import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { AuthenticationService } from '../../authentication/authentication.service';
import { I18nService } from '../../i18n.service';
import { UserService } from '../../../profile/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;
  userName = "Mikvah User";

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private i18nService: I18nService) { }

  ngOnInit() {
    if(this.authenticationService.isAuthenticated()){
      this.userService.getUserName().subscribe(data => {this.userName = data;});
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout();
  }

  login() {
    this.authenticationService.login();
  }

  get loggedIn(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

}
