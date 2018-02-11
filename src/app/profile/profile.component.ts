import 'rxjs/add/operator/finally';

import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import { countries, Country, State, Region } from "typed-countries";
import { parse, format, asYouType, CountryCode } from 'libphonenumber-js';
import { MembershipService } from '../membership/membership.service';


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
  card: any;
  cardHandler = this.onCardChange.bind(this);
  stripe: any;
  cardError: string;
  cardInitialized: boolean = false;
  savedCreditCard: string;
  hasSavedCard: boolean = false;
  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
     private cd: ChangeDetectorRef,
     private userService: UserService,
     private membershipService: MembershipService
    ) {}

  ngOnInit() {
    this.countries = this.countries.filter(country => country.iso !== "PS");
    this.populateUserData();
  }

  populateUserData(){
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
        
        if(this.model.defaultCard){
          this.hasSavedCard = true;
          this.savedCreditCard = this.model.defaultCard.brand + " ending in " + this.model.defaultCard.last4;
        } else {
          this.hasSavedCard = true;
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

  ngAfterViewInit() {
    this.stripe = (<any> window).Stripe('pk_test_Xrh9lP7HMEWdXVqy6l2ixTqi');
    const elements = this.stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    const style = {
      base: {
        // Add your base input styles here. For example:
        lineHeight: '1.429'
      },
    };

    // Create an instance of the card Element
    this.card = elements.create('card', {style});
    
  }

  ngAfterViewChecked(){
    if(this.cardInfo && !this.cardInitialized){
      this.cardInitialized = true;
      this.card.mount(this.cardInfo.nativeElement);
      this.card.addEventListener('change', this.cardHandler);
    }
  }

  ngOnDestroy() {
    if(this.card){
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  clearMessages(){
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;
    this.showMessage = false;
    this.message = "";
  }

  showSuccessMessage(message: string){
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = true;
    this.showMessage = true;
    this.message = message;
  }

  showErrorMessage(message: string){
    this.alertClasses['alert-danger'] = true;
    this.alertClasses['alert-success'] = false;
    this.showMessage = true;
    this.message = message;
  }

  onCardChange({error} : { error: any}) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }

  onSubmit() {

    this.clearMessages();

    if(this.model.phoneNumber){
      let parsedPhoneNumber = parse(this.model.phoneNumber, this.model.countryCode as CountryCode);
      this.model.phoneNumber = format(parsedPhoneNumber, "International_plaintext");
    }

    this.userService.saveUser(this.model).subscribe(
      (data) => {

        this.model = data;
        this.hasNoProfile = false;
        localStorage.setItem("hasProfile", "true");

        this.showSuccessMessage("Your profile was saved!");
        
      },
      err => {
        console.error("Failed to save user!", err);
        this.showErrorMessage("There was a problem getting your profile information. Please try again later.");
      }
    )
  }

  onPhoneNumberChange(){

    this.model.phoneNumber = new asYouType(this.model.countryCode as CountryCode).input(this.model.phoneNumber);

  }

  async updateCard(){
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      console.log('Something is wrong:', error);
      this.showErrorMessage("There was a problem processing your credit card. Please try again later.");
    } else {
      console.log('Success!', token);
      this.membershipService.saveCreditCard(token.id).subscribe(message => {
        console.log("Saved card", message)
        this.showSuccessMessage("Your new credit card information has been saved.");
        this.populateUserData();
      }, error => {
        console.log("Error saving card", error);
        this.showErrorMessage("There was a problem processing your credit card. Please try again later.");
      });
    }
  }

}
