import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { DailyHours } from './daily-hours';

const hoursPath = '/api/hours';


@Injectable()
export class HoursService {

  constructor(private http: HttpClient) { }

  getHours(): Observable<Array<DailyHours>> {
    return this.http.get<Array<DailyHours>>(hoursPath);
  }

}
