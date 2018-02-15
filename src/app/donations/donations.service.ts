import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { DonationResponse } from './donation-response';

const donationPath = '/api/donate';
const saveCreditCardPath = '/api/credit-card';


@Injectable()
export class DonationsService {

  constructor(private http: HttpClient) { }

  makeDonation(amount: number, token: string): Observable<DonationResponse> {
    let donation = {
      amount: amount,
      token: token
    }
    return this.http.post<DonationResponse>(donationPath, donation);
 }

  saveCreditCard(token: string): Observable<string> {
     let cardRequest = {
       token: token
     }
     return this.http.post<string>(saveCreditCardPath, cardRequest);
  }

}
