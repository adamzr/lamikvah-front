import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

const userPath = 'http://localhost:8080/user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  saveUser(user: User): Observable<User> {
    return this.http.post(userPath, user);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(userPath);
  }

}
