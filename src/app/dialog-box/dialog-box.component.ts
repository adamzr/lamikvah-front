import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AvailableTime } from '../appointments/available-time';

export interface AppointmentUpdateView {
  obj: any,
  action: string,
  times: Array<AvailableTime>,
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  action: string;
  times: Array<AvailableTime>;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AppointmentUpdateView) {
    console.log(data);
    this.local_data = {...data};
    this.action = data.obj.action;
    this.times = data.times;
    console.log('action', this.action);
  }

  doAction(){
    this.dialogRef.close({event:this.action, data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
