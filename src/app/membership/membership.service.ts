import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { MembershipResponse } from './membership-response';

const membershipPath = '/api/membership';
const saveCreditCardPath = '/api/credit-card';


@Injectable()
export class MembershipService {

  constructor(private http: HttpClient) { }

  createMembership(plan: string): Observable<MembershipResponse> {
    let donation = {
      plan: plan
    }
    return this.http.post<MembershipResponse>(membershipPath, donation);
 }

  saveCreditCard(token: string): Observable<string> {
     let cardRequest = {
       token: token
     }
     return this.http.post<string>(saveCreditCardPath, cardRequest);
  }

}
