import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-mens',
  templateUrl: './mens.component.html',
  styleUrls: ['./mens.component.scss']
})
export class MensComponent implements OnInit {

  version: string = environment.version;

  constructor() { }

  ngOnInit() { }

}
