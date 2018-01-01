import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AvailableDay } from './available-day';
import { AvailableTime } from './available-time';

import { HttpClient } from '@angular/common/http';
import { AppointmentCreationResponse } from './appointment-creation-response';

const appointmentsAvailabilityPath = 'http://localhost:8080/appointments/availability';
const appointmentCreationPath = 'http://localhost:8080/appointments';
const appointmentCancellationPath = 'http://localhost:8080/appointments/';
const saveCreditCardPath = 'http://localhost:8080/credit-card';


@Injectable()
export class AppointmentsService {

  constructor(private http: HttpClient) { }

  createAppointment(time: string): Observable<AppointmentCreationResponse> {
    let appointmentRequest = {
      time: time
    }
    return this.http.post<AppointmentCreationResponse>(appointmentCreationPath, appointmentRequest);
 }

 cancelAppointment(id: number): Observable<string>{
   return this.http.delete<string>(appointmentCancellationPath + id);
 }

  saveCreditCard(token: string): Observable<string> {
     let cardRequest = {
       token: token
     }
     return this.http.post<string>(saveCreditCardPath, cardRequest);
  }

  getAvailabilityMap(): Observable<[Array<AvailableDay>, Map<string, Array<AvailableTime>>]> {
    return this.http.get<Array<string>>(appointmentsAvailabilityPath).map(times => {
      let responseTuple : [Array<AvailableDay>, Map<string, Array<AvailableTime>>];
      let availableDays: Array<AvailableDay> = [];
      let availabilityMap: Map<string, Array<AvailableTime>> = new Map<string, Array<AvailableTime>>();
      for(let time of times){

        let momentTime = moment(time);
        let isoDay = momentTime.format("YYYY-MM-DD");
        
        if(!availabilityMap.has(isoDay)){
          let displayDay = momentTime.format("dddd, MMMM D, Y");
          let availableDay = new AvailableDay(isoDay, displayDay);
          availableDays.push(availableDay);
          availabilityMap.set(isoDay, []);
        }
        let isoTime = momentTime.format("HH:mm:ss");
        let displayTime = momentTime.format("LT");
        let availabilityTime = new AvailableTime(isoTime, displayTime);
        availabilityMap.get(isoDay).push(availabilityTime);
      }
      responseTuple = [availableDays, availabilityMap];
      return responseTuple;
    });
  }

}
