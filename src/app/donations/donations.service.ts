import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { DonationResponse } from './donation-response';

const loggedInDonationPath = '/api/donate';
const guestDonationPath = '/api/donate-guest';
const saveCreditCardPath = '/api/credit-card';


@Injectable()
export class DonationsService {

  constructor(private http: HttpClient) { }

  makeDonation(name: string, email: string, amount: number, token: string, isLoggedIn: boolean): Observable<DonationResponse> {
    let donation = {
      amount: amount,
      token: token,
      name: name,
      email: email
    }
    let donationPath = isLoggedIn ? loggedInDonationPath : guestDonationPath;
    return this.http.post<DonationResponse>(donationPath, donation);
 }

  saveCreditCard(token: string): Observable<string> {
     let cardRequest = {
       token: token
     }
     return this.http.post<string>(saveCreditCardPath, cardRequest);
  }

}
