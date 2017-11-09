import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';

@Component({
  selector: 'app-home',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  quote: string;
  isLoading: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    // this.quoteService.getRandomQuote({ category: 'dev' })
    //   .finally(() => { this.isLoading = false; })
    //   .subscribe((quote: string) => { this.quote = quote; });
  }

}
