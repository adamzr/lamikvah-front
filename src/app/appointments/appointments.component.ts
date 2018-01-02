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
import { AppointmentTime } from './appointment-time';
import { AppointmentsService } from './appointments.service';
import { AvailableDay } from './available-day';
import { AvailableTime } from './available-time';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { User } from '../profile/user';
import { UserService } from '../profile/user.service';
import * as moment from 'moment';
import { AppointmentSlot } from '../profile/appointment';
import { lang } from 'moment';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, AfterViewInit, OnDestroy {

  version: string = environment.version;

  hasCurrentAppointment: boolean = false;
  hasAvailabilityData: boolean = false;
  hasSavedCreditCard: boolean = false;
  isLoggedIn: boolean = false;
  isMember: boolean;
  availableDays: Array<AvailableDay>;
  availableTimes: Array<AvailableTime>;
  availabilityMap: Map<string, Array<AvailableTime>>;
  model: AppointmentTime = new AppointmentTime("","", "saved");
  card: any;
  cardHandler = this.onCardChange.bind(this);
  stripe: any;
  error: string;
  stripeInitialized: boolean = false;
  user: User;
  currentAppointment: string;
  currentAppointmentId: number;
  savedCreditCard: string;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
    private appointmentsService: AppointmentsService,
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

  onDateSelectionChange(){
    this.availableTimes = this.availabilityMap.get(this.model.date);
    this.model.time = this.availableTimes[0].isoTime;
  }

  ngOnInit(){
    this.appointmentsService.getAvailabilityMap().subscribe(
      data => {
        this.hasAvailabilityData = true;
        this.availableDays = data[0];
        this.availabilityMap = data[1];
        this.model.date = this.availableDays[0].isoDay;
        this.availableTimes = this.availabilityMap.get(this.model.date);
        this.model.time = this.availableTimes[0].isoTime;
      }
    );
    this.isLoggedIn = this.authService.isAuthenticated();
    this.populateUserInfo();
  }

  populateUserInfo(){
    this.userService.getUser().subscribe(
      user => {
        this.user = user;
        if(user.currentAppointment){
          this.processCurrentAppointment(user.currentAppointment);
        }

        if(user.defaultCard){
          this.hasSavedCreditCard = true;
          this.savedCreditCard = user.defaultCard.brand + " ending in " + user.defaultCard.last4;
        }

        this.isMember = user.member

      } 
    );
  }

  processCurrentAppointment(slot: AppointmentSlot){
    let momentTime = moment(slot.start);
    this.currentAppointment =  momentTime.format("dddd, MMMM Do, YYYY [at] h:mm a");
    this.currentAppointmentId = slot.id;
    this.hasCurrentAppointment = true;
  }

  async onSubmit(form: NgForm) {

    if(this.model.paymentMethod === "new"){
      const { token, error } = await this.stripe.createToken(this.card);
      if (error) {
        console.log('Something is wrong:', error);
      } else {
        console.log('Success!', token);
        this.appointmentsService.saveCreditCard(token.id).subscribe(message => {
          console.log("Saved card", message)
          this.saveAppointment();
        });
      }
    } else {
      this.saveAppointment();
    }
    this.populateUserInfo();
    
  }

  saveAppointment(){
    console.log("Selected Date", this.model.date);
    console.log("Selected Time", this.model.time);
    this.appointmentsService.createAppointment(this.model.date + "T" + this.model.time).subscribe(response => {
      console.log("Got response for making appointment.", response);
      if(response.slot){
        this.processCurrentAppointment(response.slot);
      } else {
        alert(response.message);
      }
    });
  }

  logIn(){
    this.authService.login();
    return false;
  }

  cancelAppointment(){
    this.appointmentsService.cancelAppointment(this.currentAppointmentId).subscribe(message => {
      this.stripeInitialized = false;
      this.hasCurrentAppointment = false;
      this.currentAppointment = "";
      this.currentAppointmentId = 0;
    });
  }

}
