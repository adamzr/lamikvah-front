import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentsService } from '../appointments/appointments.service';
import { AvailableTime } from '../appointments/available-time';
import { Appointment } from './appointment';
import { UserService } from '../profile/user.service';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Angulartics2 } from '../../../node_modules/angulartics2';

@Component({
  selector: 'app-schedule',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  alertClasses =  {
    'alert': true,
    'alert-danger': false,
    'alert-success':  false
  };
  showMessage: boolean = false;
  message: string;

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  selectedDate: string;
  schedule: Array<Appointment>;
  displayedColumns: string[] = ['time', 'roomType', 'title', 'firstName', 'lastName', 'email', 'phone', 'notes', 'action'];
  allowEdits: boolean = false;
  selectedId: number;
  selectedRoomType: string;

  availableTimes: Array<AvailableTime>;
  dayToRoomTypeToAvailableTimes: Map<string, Map<string, Array<AvailableTime>>>;
  
  //use Swedish formatting, which is similar to ISO-8601
  currentDatePacific: string = new Date().toLocaleDateString('sv', {timeZone: 'America/Los_Angeles'});

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private appointmentsService: AppointmentsService,
              private angulartics2: Angulartics2,
              private dialog: MatDialog) { }

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
          this.alertClasses['alert-danger'] = true;
          this.alertClasses['alert-success'] = false;
          this.showMessage = true;
          this.message = "There was a problem getting your profile information. Please try again later.";
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
          this.appointmentsService.getAvailabilityMap().subscribe(
            data => {
              this.allowEdits = data[1].has(date.split("T")[0]);
            }
          );
          this.schedule = data;
          this.selectedDate = date.split("T")[0];
        }
      );
    }
  }

  openDialog(action: any, obj: { action: any, id: number, roomType: string, notes: string}) {
    obj.action = action;
    this.selectedId = obj.id;
    this.selectedRoomType = obj.roomType;

    this.appointmentsService.getAvailabilityMap().subscribe(
      data => {
        this.dayToRoomTypeToAvailableTimes = data[1];
        this.availableTimes = this.dayToRoomTypeToAvailableTimes.get(this.selectedDate).get(this.selectedRoomType.toUpperCase());

        const dialogRef = this.dialog.open(DialogBoxComponent, {
          width: '250px',
          data: {
            obj,
            times: this.availableTimes
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update'){
            this.updateRowData(result.data);
          } else if(result.event == 'Delete'){
            this.deleteRowData(result.data);
          }
        });
      });
  }

  updateRowData(data: {obj: { action: any, id: number, roomType: string, notes: string}, time: string }){
    let requestedTime = data.time ? this.selectedDate + "T" + data.time : null;
    this.appointmentsService.editAppointment(data.obj.id, requestedTime, data.obj.notes)
      .subscribe(response => {
        this.alertClasses['alert-danger'] = false;
        this.alertClasses['alert-success'] = true;
        this.showMessage = true;
        this.message = response.message;

        this.populateScheduleFor(this.selectedDate)
      }, error => {
        console.error("Error editing appointment.", error)
        this.alertClasses['alert-danger'] = true;
        this.alertClasses['alert-success'] = false;
        this.showMessage = true;
        this.message = "There was a problem editing the appointment. Please try again later.";
      })
  }

  deleteRowData(data: {obj: { action: any, id: number, roomType: string}, time: string }){
    this.cancelAppointment(data.obj.id)
  }

  cancelAppointment(id: number){
    this.clearMessages();
    this.appointmentsService.cancelAppointment(id).subscribe(message => {
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
      
      this.populateScheduleFor(this.selectedDate)
    }, error => {
      console.error("Error canceling appointment.", error)
      this.alertClasses['alert-danger'] = true;
      this.alertClasses['alert-success'] = false;
      this.showMessage = true;
      this.message = "There was a problem canceling the appointment. Please try again later.";
    });
  }

  loadAvailabilityMap(){
    console.log('Loading availability...')
    this.appointmentsService.getAvailabilityMap().subscribe(
      data => {
        this.dayToRoomTypeToAvailableTimes = data[1];
        this.availableTimes = this.dayToRoomTypeToAvailableTimes.get(this.selectedDate).get(this.selectedRoomType.toUpperCase());
      });
  }

  clearMessages(){
    this.alertClasses['alert-danger'] = false;
    this.alertClasses['alert-success'] = false;
    this.showMessage = false;
    this.message = "";
  }
}
