import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';

import { AuthenticationService } from '../core/authentication/authentication.service';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  version: string = environment.version;
  isLoading: boolean = true;

  constructor(public auth: AuthenticationService) {
    auth.handleAuthentication();
  }

  ngOnInit() {

  }

}
