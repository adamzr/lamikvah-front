import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { User } from './user';
import { countries, Country, State, Region } from "typed-countries";
import { parse, format, asYouType, CountryCode } from 'libphonenumber-js';


@Component({
  selector: 'app-home',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  model: User;
  message: string = "";
  showMessage: boolean = false;
  hasNoProfile: boolean = true;
  countries: Array<Country> = countries;
  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.countries = this.countries.filter(country => country.iso !== "PS");
    this.userService.getUser().subscribe(
      data => {
        this.model = data;
        if(data.firstName || data.lastName){
          this.hasNoProfile = false;
        }
        if(!this.model.countryCode){
          this.model.countryCode = "US";
        }
        if(!this.model.city){
          this.model.city = "Los Angeles";
        }
        if(!this.model.postalCode){
          this.model.postalCode = "90035";
        }
        if(!this.model.stateCode){
          this.model.stateCode = "CA";
        }
      },
      err => {
        console.error("Failed to get user!", err);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem getting your profile information. Please try again later.";
      }
    );
  }

  onSubmit() {

    this.showMessage = false;
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;

    console.log(this.model.phoneNumber);
    if(this.model.phoneNumber){
      let parsedPhoneNumber = parse(this.model.phoneNumber, this.model.countryCode as CountryCode);
      console.log(parsedPhoneNumber);
      this.model.phoneNumber = format(parsedPhoneNumber, "International_plaintext");
      console.log(this.model.phoneNumber);

    }

    this.userService.saveUser(this.model).subscribe(
      (data) => {
        this.model = data;
        this.alertClasses['alert-danger'] = false;
        this.alertClasses['alert-success'] = true;
        this.showMessage = true;
        this.hasNoProfile = false;
        this.message = "Your profile was saved!";
        localStorage.setItem("hasProfile", "true");
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

  onPhoneNumberChange(){
    this.model.phoneNumber = new asYouType(this.model.countryCode as CountryCode).input(this.model.phoneNumber);
  }

}
