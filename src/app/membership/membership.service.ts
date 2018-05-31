



import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { MembershipResponse } from './membership-response';

const membershipPath = '/api/membership';
const saveCreditCardPath = '/api/credit-card';
const autoRenewPath = '/api/auto-renew';


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

  enableAutoRenew(): Observable<MembershipResponse> {
    return this.http.post<MembershipResponse>(autoRenewPath, {"enabled": true});
  }

  disableAutoRenew(): Observable<MembershipResponse> {
    return this.http.post<MembershipResponse>(autoRenewPath, {"enabled": false});
  }

}
