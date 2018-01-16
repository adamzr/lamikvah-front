import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { environment } from '../../environments/environment';
import { User } from '../profile/user';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { UserService } from '../profile/user.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { Donation } from './donation';
import { DonationsService } from './donations.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit, AfterViewInit, OnDestroy {

  version: string = environment.version;
  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };
  showMessage: boolean = false;
  message: string;
  model: Donation = new Donation(54.00, "new");
  card: any;
  cardHandler = this.onCardChange.bind(this);
  stripe: any;
  error: string;
  stripeInitialized: boolean = false;
  user: User;
  currentAppointment: string;
  currentAppointmentId: number;
  savedCreditCard: string;
  hasSavedCreditCard: boolean = false;

  @ViewChild('cardInfo') cardInfo: ElementRef;


  constructor(
    private cd: ChangeDetectorRef,
    private donationsService: DonationsService,
    private authService: AuthenticationService,
    private userService: UserService) { }

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
    if(this.cardInfo && !this.stripeInitialized){
      this.stripeInitialized = true;
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
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      this.populateUserInfo();
    }
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

      },
      error => {
        console.error("Failed to get user!", error);
      }
    );
  }

  clearMessages(){
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;
    this.showMessage = false;
    this.message = "";
  }

  async onSubmit(form: NgForm) {
    this.clearMessages();
    if(this.model.paymentMethod === "new"){
      const { token, error } = await this.stripe.createToken(this.card);
      if (error) {
        console.log('Something is wrong:', error);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem processing your credit card. Please try again later.";
      } else {
        console.log('Success!', token);
        this.donationsService.saveCreditCard(token.id).subscribe(message => {
          console.log("Saved card", message);
          this.makeDonation();
        }, error => {
          console.log("Error saving card", error);
          this.alertClasses['alert-danger'] = true;
          this.alertClasses['alert-success'] = false;
          this.showMessage = true;
          this.message = "There was a problem processing your credit card. Please try again later.";
        });
      }
    } else {
      this.makeDonation();
    }
    this.populateUserInfo();
    
  }

  makeDonation(){
    this.donationsService.makeDonation(this.model.amount).subscribe(response => {
      console.log("Got response for making donation.", response);
        this.alertClasses['alert-danger'] = false;
        this.alertClasses['alert-success'] = true;
        this.showMessage = true;
        this.message = response.message;
    }, error => {
      console.error("Error making donation.", error)
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "There was a problem making your donation. Please try again later.";
    });
  }

}
