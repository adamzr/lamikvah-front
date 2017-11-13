import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { User } from './user';

@Component({
  selector: 'app-home',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  model: User;
  message: string = "";
  showMessage: boolean = false;
  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe(
      data => {this.model = data},
      err => {
        console.error("Failed to get user!", err);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem getting your profile information. Please try again later."
      }
    );
  }

  onSubmit() {

    this.showMessage = false;
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;

    this.userService.saveUser(this.model).subscribe(
      (data) => {
        this.model = data;
        this.alertClasses['alert-danger'] = false;
        this.alertClasses['alert-success'] = true;
        this.showMessage = true;
        this.message = "Your profile was saved!"
      },
      err => {
        console.error("Failed to save user!", err);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem getting your profile information. Please try again later."
      }
    )
  }

  get diagnostic() { return JSON.stringify(this.model); }

}
