import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

const routes = {
  quote: (c: RandomQuoteContext) => 'http://localhost:8080/user'//`/jokes/random?category=${c.category}`
};

export interface RandomQuoteContext {
  // The quote's category: 'nerdy', 'explicit'...
  category: string;
}

@Injectable()
export class UserService {

  constructor(private http: AuthHttp) { }

  getRandomQuote(context: RandomQuoteContext): Observable<string> {
    return this.http.get(routes.quote(context), { cache: false })
      .map((res: Response) => res.json())
      .map(body => "Hello, " + body.auth0UserId)
      .catch((err) => {
        console.error(err);
        return Observable.of('Error, could not load joke :-(')
      });
  }

}
