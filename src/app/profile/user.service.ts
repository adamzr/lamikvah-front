import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

const userPath = '/api/user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  saveUser(user: User): Observable<User> {
    return this.http.post<User>(userPath, user);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(userPath);
  }

  getUserName(): Observable<string> {
    if(!localStorage.userName){
      return this.getUser().pipe(map(user => {
        if(user.firstName || user.lastName){
          var userName = (this.nullSafeString(user.title) + " " + this.nullSafeString(user.firstName) + " " + this.nullSafeString(user.lastName)).trim();
          localStorage.userName = userName;
          return userName;
        } else {
          return "Mikvah User";
        }
      }));
    } else {
      return of(localStorage.userName);
    }
  }

  nullSafeString(str: string){
    if(!str){
      return "";
    }
    return str;
  }

}
