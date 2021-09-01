import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../authentication/authentication.service';
import { UserService } from '../../../profile/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;
  userName = "Mikvah User";
  isAdmin = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    if(this.authenticationService.isAuthenticated()){
      this.userService.getUserName().subscribe(data => {this.userName = data;});
      this.userService.getUser().subscribe(user => {this.isAdmin = user.admin;});
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
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

}
