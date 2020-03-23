

import { Component, OnInit } from '@angular/core';
import { HoursService } from './hours.service';
import { DisplayHours } from './display-hours';
import moment from 'moment';
import { lang } from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  dailyHours: DisplayHours[] = [];
  firstDayInWeek: string;

  constructor(private hoursService: HoursService) {}

  ngOnInit(){
    this.hoursService.getHours().subscribe(
      hours => {
        this.firstDayInWeek = moment(hours[0].day).format("ll");
        for(let hour of hours){
          let start = moment(hour.opening, "HH:mm:ss").format("LT");
          let end = moment(hour.closing, "HH:mm:ss").format("LT");
          let weekday = moment(hour.day).format("ddd");
          this.dailyHours.push(
            new DisplayHours(start, end, weekday, hour.closed)
          );
        }
      },
      error => {
        console.error("There was an error getting the mikvah's hours", error);
        this.dailyHours = [];
      }
    );
  }
}
