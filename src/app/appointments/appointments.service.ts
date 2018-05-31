import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableDay } from './available-day';
import { AvailableTime } from './available-time';

import { HttpClient } from '@angular/common/http';
import { AppointmentCreationResponse } from './appointment-creation-response';

const appointmentsAvailabilityPath = '/api/appointments/availability';
const appointmentCreationPath = '/api/appointments';
const appointmentCancellationPath = '/api/appointments/';
const saveCreditCardPath = '/api/credit-card';


@Injectable()
export class AppointmentsService {

  constructor(private http: HttpClient) { }

  createAppointment(time: string, notes: string): Observable<AppointmentCreationResponse> {
    let appointmentRequest = {
      time: time,
      notes: notes
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
    return this.http.get<Array<string>>(appointmentsAvailabilityPath).pipe(map(times => {
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
    }));
  }

}
