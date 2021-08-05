import moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableDay } from './available-day';
import { AvailableTime } from './available-time';

import { HttpClient } from '@angular/common/http';
import { AppointmentCreationResponse } from './appointment-creation-response';
import { stringLiteral } from 'babel-types';
import { AvailableDateTimeAndType } from './available-datetime-and-type';
import {Appointment} from '../admin/appointment';

const appointmentsAvailabilityPath = '/api/appointments/availability';
const appointmentCreationPath = '/api/appointments';
const appointmentCancellationPath = '/api/appointments/';
const saveCreditCardPath = '/api/credit-card';
const adminAppointmentsViewPath = '/api/admin-daily-list';


@Injectable()
export class AppointmentsService {

  constructor(private http: HttpClient) { }

  createAppointment(time: string, notes: string, roomType: string): Observable<AppointmentCreationResponse> {
    let appointmentRequest = {
      time: time,
      notes: notes,
      roomType: roomType
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

  getAppointmentScheduleFor(date: string): Observable<Array<Appointment>> {
    const request = {
      date: date
    };
    return this.http.post<Array<Appointment>>(adminAppointmentsViewPath, request);
  }

  getAvailabilityMap(): Observable<[Array<AvailableDay>, Map<string, Map<string, Array<AvailableTime>>>]> {
    return this.http.get<Array<AvailableDateTimeAndType>>(appointmentsAvailabilityPath).pipe(map(dateTimeAndTypes => {
      let responseTuple : [Array<AvailableDay>, Map<string, Map<string, Array<AvailableTime>>>];
      let availableDays: Array<AvailableDay> = [];
      let dateToRoomTypeToTimes: Map<string, Map<string, Array<AvailableTime>>> = new Map<string, Map<string, Array<AvailableTime>>>();
      for(let dateTimeAndType of dateTimeAndTypes){

        let momentTime = moment(dateTimeAndType.dateTime);
        let isoDay = momentTime.format("YYYY-MM-DD");

        if(!dateToRoomTypeToTimes.has(isoDay)){
          let displayDay = momentTime.format("dddd, MMMM D, Y");
          let availableDay = new AvailableDay(isoDay, displayDay);
          availableDays.push(availableDay);
          let emptyRoomTypeToTimesMap : Map<string, AvailableTime[]> = new Map<string, AvailableTime[]>();
          emptyRoomTypeToTimesMap.set("BATH", []);
          emptyRoomTypeToTimesMap.set("SHOWER", []);
          dateToRoomTypeToTimes.set(isoDay, emptyRoomTypeToTimesMap);
        }
        let isoTime = momentTime.format("HH:mm:ss");
        let displayTime = momentTime.format("LT");
        let availabilityTime = new AvailableTime(isoTime, displayTime);

        let roomTypeToTimes = dateToRoomTypeToTimes.get(isoDay);
        let roomType = dateTimeAndType.roomType;
        let times = roomTypeToTimes.get(roomType);
        if(!times){
          roomTypeToTimes.set(roomType, []);
          times = roomTypeToTimes.get(roomType);
        }
        times.push(availabilityTime);
      }
      responseTuple = [availableDays, dateToRoomTypeToTimes];
      return responseTuple;
    }));
  }

}
