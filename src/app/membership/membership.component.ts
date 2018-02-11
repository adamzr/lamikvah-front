import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { User } from '../profile/user';
import { UserService } from '../profile/user.service';
import * as moment from 'moment';
import { AppointmentSlot } from '../profile/appointment';
import { lang } from 'moment';
import { Membership } from './membership';
import { MembershipService } from './membership.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };
  showMessage: boolean = false;
  message: string;
  hasSavedCreditCard: boolean = false;
  isLoggedIn: boolean = false;
  isMember: boolean;
  model: Membership = new Membership("standard-1", "new");
  card: any;
  cardHandler = this.onCardChange.bind(this);
  stripe: any;
  cardError: string;
  cardInitialized: boolean = false;
  user: User;
  currentLevel: string;
  expirationDate: string;
  autoRenewalEnabled: boolean = true;
  savedCreditCard: string;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
    private membershipService: MembershipService,
    private cd: ChangeDetectorRef,
    private authService: AuthenticationService,
    private userService: UserService
    ) { }

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

  onCardChange({error} : { error: any}) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }

  ngOnInit(){
    this.isLoggedIn = this.authService.isAuthenticated();
    this.populateUserInfo();
  }

  populateUserInfo(){
    this.userService.getUser().subscribe(
      user => {
        this.user = user;

        if(user.defaultCard){
          this.hasSavedCreditCard = true;
          this.savedCreditCard = user.defaultCard.brand + " ending in " + user.defaultCard.last4;
          this.model.paymentMethod = "saved";
        } else {
          this.model.paymentMethod = "new";
        }

        this.isMember = user.member;
        this.currentLevel = user.membershipPlan;
        this.expirationDate = user.membershipExpirationDate;
        this.autoRenewalEnabled = user.membershipAutoRenewalEnabled;

      },
      error => {
        console.error("Failed to get user!", error);
        this.showErrorMessage("There was a problem getting your profile information. Please try again later.");
      }
    );
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

  disableAutoRenew(){
    this.clearMessages();
    this.membershipService.disableAutoRenew().subscribe(response => {
      this.showSuccessMessage(response.message);
      this.populateUserInfo();
    }, error => {
      console.error("Disabling auto-renew error", error);
      this.showErrorMessage("There was a problem disabling auto-renew. Please try again later.");
    });
  }

  enableAutoRenew(){
    this.clearMessages();
    this.membershipService.enableAutoRenew().subscribe(response => {
      this.showSuccessMessage(response.message);
      this.populateUserInfo();
    }, error => {
      console.error("Enabling auto-renew error", error);
      this.showErrorMessage("There was a problem enabling auto-renew. Please try again later.");
    });
  }

  async onCreateSubmit(form: NgForm) {
    this.clearMessages();
    if(this.model.paymentMethod === "new"){
      const { token, error } = await this.stripe.createToken(this.card);
      if (error) {
        console.log('Something is wrong:', error);
        this.showErrorMessage("There was a problem processing your credit card. Please try again later.");
      } else {
        console.log('Success!', token);
        this.membershipService.saveCreditCard(token.id).subscribe(message => {
          console.log("Saved card", message)
          this.createMembership();
        }, error => {
          console.log("Error saving card", error);
          this.showErrorMessage("There was a problem processing your credit card. Please try again later.");
        });
      }
    } else {
      this.createMembership();
    }
    this.populateUserInfo();
    
  }

  createMembership(){
    this.membershipService.createMembership(this.model.plan).subscribe(response => {
      console.log("Got response for creating membership.", response);
      this.showSuccessMessage(response.message);
    }, error => {
      console.error("Error creating membership.", error)
      this.showErrorMessage("There was a problem processing your membership request. Please try again later.");
    });
  }

  logIn(){
    this.authService.login();
    return false;
  }

}
