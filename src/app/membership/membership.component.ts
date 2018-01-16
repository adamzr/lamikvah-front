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
  createCard: any;
  updateCard: any;
  createCardHandler = this.onCreateCardChange.bind(this);
  updateCardHandler = this.onUpdateCardChange.bind(this);
  stripe: any;
  createCardError: string;
  updateCardError: string;
  stripeCreateCardInitialized: boolean = false;
  stripeUpdateCardInitialized: boolean = false;
  user: User;
  currentLevel: string;
  expirationDate: string;
  savedCreditCard: string;

  @ViewChild('createCardInfo') createCardInfo: ElementRef;
  @ViewChild('updateCardInfo') updateCardInfo: ElementRef;

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
    this.createCard = elements.create('card', {style});
    this.updateCard = elements.create('card', {style});
    
  }

  ngAfterViewChecked(){
    if(this.createCardInfo && !this.stripeCreateCardInitialized){
      this.stripeCreateCardInitialized = true;
      this.createCard.mount(this.createCardInfo.nativeElement);
      this.createCard.addEventListener('change', this.createCardHandler);
    }

    if(this.updateCardInfo && !this.stripeUpdateCardInitialized){
      this.stripeUpdateCardInitialized = true;
      this.updateCard.mount(this.updateCardInfo.nativeElement);
      this.updateCard.addEventListener('change', this.updateCardHandler);
    }
  }

  ngOnDestroy() {
    if(this.createCard){
      this.createCard.removeEventListener('change', this.createCardHandler);
      this.createCard.destroy();
    }
    if(this.updateCard){
      this.updateCard.removeEventListener('change', this.updateCardHandler);
      this.updateCard.destroy();
    }
  }

  onCreateCardChange({error} : { error: any}) {
    if (error) {
      this.createCardError = error.message;
    } else {
      this.createCardError = null;
    }
    this.cd.detectChanges();
  }

  onUpdateCardChange({error} : { error: any}) {
    if (error) {
      this.updateCardError = error.message;
    } else {
      this.updateCardError = null;
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

      },
      error => {
        console.error("Failed to get user!", error);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem getting your profile information. Please try again later.";
      }
    );
  }

  clearMessages(){
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;
    this.showMessage = false;
    this.message = "";
  }

  async updateMembershipCard(){
    this.clearMessages();
    const { token, error } = await this.stripe.createToken(this.updateCard);
    if (error) {
      console.log('Something is wrong:', error);
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "There was a problem processing your credit card. Please try again later.";
    } else {
      console.log('Success!', token);
      this.membershipService.saveCreditCard(token.id).subscribe(message => {
        console.log("Saved card", message);
        this.alertClasses['alert-danger'] = false;
        this.alertClasses['alert-success'] = true;
        this.showMessage = true;
        this.message = "Your card has been updated. Thank you!";
      }, error => {
        console.error("Error saving card", error);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem processing your credit card. Please try again later.";
      });
    }
  }

  async onCreateSubmit(form: NgForm) {
    this.clearMessages();
    if(this.model.paymentMethod === "new"){
      const { token, error } = await this.stripe.createToken(this.createCard);
      if (error) {
        console.log('Something is wrong:', error);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem processing your credit card. Please try again later.";
      } else {
        console.log('Success!', token);
        this.membershipService.saveCreditCard(token.id).subscribe(message => {
          console.log("Saved card", message)
          this.createMembership();
        }, error => {
          console.log("Error saving card", error);
          this.alertClasses['alert-danger'] = true;
          this.alertClasses['alert-success'] = false;
          this.showMessage = true;
          this.message = "There was a problem processing your credit card. Please try again later.";
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
      this.alertClasses['alert-danger'] = false;
      this.alertClasses['alert-success'] = true;
      this.showMessage = true;
      this.message = response.message;
    }, error => {
      console.error("Error creating membership.", error)
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "There was a problem processing your membership request. Please try again later.";
    });
  }

  logIn(){
    this.authService.login();
    return false;
  }

}
