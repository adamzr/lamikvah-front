import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppointmentRequest } from './appointment-request';
import { AppointmentsService } from './appointments.service';
import { AvailableDay } from './available-day';
import { AvailableTime } from './available-time';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  version: string = environment.version;

  hasCuurentAppointment: boolean = false;
  hasAvailabilityData: boolean = false;
  availableDays: Array<AvailableDay>;
  availabilityMap: Map<string, Array<AvailableTime>>;
  model: AppointmentRequest = new AppointmentRequest("","");
  card: any;
  stripe: any;

  constructor(private appointmentsService: AppointmentsService) { }

  ngOnInit(){
    this.appointmentsService.getAvailabilityMap().subscribe(
      data => {
        this.hasAvailabilityData = true;
        this.availableDays = data[0];
        this.availabilityMap = data[1];
        this.model.date = this.availableDays[0].isoDay;
        this.initStripe();
      }
    );
  }

  initStripe(){

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

    // Add an instance of the card Element into the `card-element` <div>
    this.card.mount('#card-element');
    this.card.addEventListener('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        console.log("Got error: ", error);
        displayError.textContent = error.message;
      } else {
        console.log("No CC error!");
        displayError.textContent = '';
      }
    });

  }

  onSubmit(){
    console.log("Selected Date", this.model.date);
    console.log("Selected Time", this.model.time);

    this.stripe.createToken(this.card).then(function(result) {
      if (result.error) {
        // Inform the customer that there was an error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        console.log(result.token);
      }
    });

  }

}
