import {
  Component,
  OnInit,
} from '@angular/core';

import {AppointmentsService} from '../appointments/appointments.service';
import {Appointment} from './appointment';
import {UserService} from '../profile/user.service';
import {AuthenticationService} from '../core/authentication/authentication.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-schedule',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  schedule: Array<Appointment>;
  //use Swedish formatting, which is similar to ISO-8601
  currentDatePacific: string = new Date().toLocaleDateString('sv', {timeZone: 'America/Los_Angeles'});; 

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private appointmentsService: AppointmentsService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.userService.getUser().subscribe(
        user => {
          this.isAdmin = user.admin;
          console.log('User is admin: ', this.isAdmin);
          this.populateScheduleFor(this.currentDatePacific);
        },
        error => {
          console.error("Failed to get user!", error);
          // TODO: show error message
        });
    }
  }

  getScheduleFor(type: string, event: MatDatepickerInputEvent<Date>) {
    this.populateScheduleFor(event.value.toISOString());
  }


  private populateScheduleFor(date: string) {
    if (this.isAdmin) {
      console.log('Getting schedule for', date);
      this.appointmentsService.getAppointmentScheduleFor(date).subscribe(
        data => {
          console.log('Schedule: ', data);
          this.schedule = data;
        });
    }
  }
}
