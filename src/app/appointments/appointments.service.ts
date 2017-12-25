import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AvailableDay } from './available-day';
import { AvailableTime } from './available-time';

import { HttpClient } from '@angular/common/http';

const appointmentsAvailabilityPath = 'http://localhost:8080/appointments/availability';

@Injectable()
export class AppointmentsService {

  constructor(private http: HttpClient) { }

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
