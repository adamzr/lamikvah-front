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
import moment from 'moment';
import { AppointmentSlot } from '../profile/appointment';
import { Angulartics2 } from '../../../node_modules/angulartics2';
import _ from "lodash";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, AfterViewInit, OnDestroy {

  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };
  showMessage: boolean = false;
  message: string;
  hasCurrentAppointment: boolean = false;
  hasAvailabilityData: boolean = false;
  hasSavedCreditCard: boolean = false;
  isLoggedIn: boolean = false;
  isMember: boolean;
  availableDays: Array<AvailableDay>;
  availableTimes: Array<AvailableTime>;
  availableRoomTypes: Array<string> = ["SHOWER", "BATH"];
  dayToRoomTypeToAvailableTimes: Map<string, Map<string, Array<AvailableTime>>>;
  model: AppointmentTime = new AppointmentTime("","", "SHOWER", "saved", "");
  card: any;
  cardHandler = this.onCardChange.bind(this);
  stripe: any;
  error: string;
  stripeInitialized: boolean = false;
  user: User;
  currentAppointment: string;
  currentAppointmentId: number;
  savedCreditCard: string;
  appointmentCreationFormSubmissionInProgress: boolean = false;
  lastCancelationDate: Date;
  isCancellable: boolean;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
    private appointmentsService: AppointmentsService,
    private cd: ChangeDetectorRef,
    private authService: AuthenticationService,
    private userService: UserService,
    private angulartics2: Angulartics2
    ) { }

  ngAfterViewInit() {
    this.stripe = (<any> window).Stripe(environment.stripeKey);
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
      this.card.removeAllListeners();
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
    this.availableTimes = this.dayToRoomTypeToAvailableTimes.get(this.model.date).get(this.model.roomType);
    if(this.availableTimes.length === 0){
      if(this.model.roomType === "SHOWER"){
        let bathTimes = this.dayToRoomTypeToAvailableTimes.get(this.model.date).get("BATH");
        if(bathTimes.length > 0){
          this.model.roomType = "BATH";
          this.availableTimes = bathTimes;
        }
      } else {
        let showerTimes = this.dayToRoomTypeToAvailableTimes.get(this.model.date).get("SHOWER");
        if(showerTimes.length > 0){
          this.model.roomType = "SHOWER";
          this.availableTimes = showerTimes;
        }
      }
    }
    this.model.time = this.availableTimes[0].isoTime;
  }

  onRoomTypeSelectionChange(){
    this.availableTimes = this.dayToRoomTypeToAvailableTimes.get(this.model.date).get(this.model.roomType);
    let isValidTime = _.filter(this.availableTimes, function(at){at.isoTime == this.model.time}).length != 0;
    if(!isValidTime){
      if(this.availableTimes.length > 0){
        this.model.time = this.availableTimes[0].isoTime;
      }
    }
  }

  ngOnInit(){
    this.isLoggedIn = this.authService.isAuthenticated();
    if(this.isLoggedIn){
      this.loadAvailabilityMap();
      this.populateUserInfo();
    }
  }

  loadAvailabilityMap(){
    this.appointmentsService.getAvailabilityMap().subscribe(
      data => {
        this.hasAvailabilityData = true;
        this.availableDays = data[0];
        this.dayToRoomTypeToAvailableTimes = data[1];
        this.model.date = this.availableDays[0].isoDay;
        this.availableTimes = this.dayToRoomTypeToAvailableTimes.get(this.model.date).get(this.model.roomType);
        if(this.availableTimes && this.availableTimes.length > 0){
          this.model.time = this.availableTimes[0].isoTime;
        }
      }
    );
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
        } else {
          this.model.paymentMethod = "new";
        }

        this.isMember = user.member;

        if(user.notes){
          this.model.notes = user.notes;
        }

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

  processCurrentAppointment(slot: AppointmentSlot){
    slot = new AppointmentSlot(slot.id, slot.start, slot.lastCancellation, slot.roomType);
    let momentTime = moment(slot.start);
    this.currentAppointment =  momentTime.format("dddd, MMMM Do, YYYY [at] h:mm a") + " (Room type: " +  _.startCase(_.lowerCase(slot.roomType)) + ")";
    this.currentAppointmentId = slot.id;
    this.hasCurrentAppointment = true;
    this.lastCancelationDate = slot.getLastCancellationDate();
    this.isCancellable = new Date() < this.lastCancelationDate;
    var timeUntilCancellationIsOver = this.lastCancelationDate.getTime() - (new Date()).getTime();
    var that = this;
    setTimeout(function(){
      that.isCancellable = new Date() < that.lastCancelationDate;
    }, timeUntilCancellationIsOver + 1000);
  }

  clearMessages(){
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;
    this.showMessage = false;
    this.message = "";
  }

  async onSubmit(form: NgForm) {
    if(this.appointmentCreationFormSubmissionInProgress){
      console.log("Submission of form already in progress. Stopping double submit.");
      return;
    }
    this.appointmentCreationFormSubmissionInProgress = true;
    this.clearMessages();
    if(!this.model.date){
      console.error('Missing date');
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "Please choose an appointment date";
      this.appointmentCreationFormSubmissionInProgress = false;
      return;
    }
    if(!this.model.time){
      console.error('Missing time');
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "Please choose an appointment time";
      this.appointmentCreationFormSubmissionInProgress = false;
      return;
    }
    if(!this.model.roomType){
      console.error('Missing room type');
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "Please choose bath or shower";
      this.appointmentCreationFormSubmissionInProgress = false;
      return;
    }
    if(!this.isMember && this.model.paymentMethod === "new"){
      const { token, error } = await this.stripe.createToken(this.card);
      if (error) {
        console.error('Something is wrong:', error);
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem processing your credit card. Please try again later.";
        this.appointmentCreationFormSubmissionInProgress = false;
      } else {
        this.appointmentsService.saveCreditCard(token.id).subscribe(message => {
          this.saveAppointment();
        }, error => {
          this.alertClasses['alert-danger'] = true;
          this.alertClasses['alert-success'] = false;
          this.showMessage = true;
          this.message = "There was a problem processing your credit card. Please try again later.";
          this.appointmentCreationFormSubmissionInProgress = false;
        });
      }
    } else {
      this.saveAppointment();
    }
    
  }

  saveAppointment(){
    this.appointmentsService.createAppointment(this.model.date + "T" + this.model.time, this.model.notes, this.model.roomType).subscribe(response => {
      if(response.slot){
        this.processCurrentAppointment(response.slot);
        this.alertClasses['alert-danger'] = false;
        this.alertClasses['alert-success'] = true;
        this.showMessage = true;
        this.message = "Your appointment was made for " + this.currentAppointment + ". Thank you!";
        this.angulartics2.eventTrack.next({ 
          action: 'created',
          properties: { 
            category: 'appointment'
          },
        });
      } else {
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = response.message;
      }
      this.populateUserInfo();
      this.appointmentCreationFormSubmissionInProgress = false;
    }, error => {
      console.error("Error making appointment.", error)
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "There was a problem making your appointment. Please try again later.";
      this.populateUserInfo();
      this.appointmentCreationFormSubmissionInProgress = false;
    });
  }

  logIn(){
    this.authService.login();
    return false;
  }

  cancelAppointment(){
    this.clearMessages();
    this.appointmentsService.cancelAppointment(this.currentAppointmentId).subscribe(message => {
      this.stripeInitialized = false;
      this.hasCurrentAppointment = false;
      this.currentAppointment = "";
      this.currentAppointmentId = 0;
      this.isCancellable = false;
      this.lastCancelationDate = null;

      this.angulartics2.eventTrack.next({ 
        action: 'cancelled',
        properties: { 
          category: 'appointment'
        },
      });

      this.alertClasses['alert-danger'] = false;
      this.alertClasses['alert-success'] = true;
      this.showMessage = true;
      this.message = message;
      
      this.loadAvailabilityMap();
    }, error => {
      console.error("Error canceling appointment.", error)
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "There was a problem canceling your appointment. Please try again later.";
    });
  }

}
