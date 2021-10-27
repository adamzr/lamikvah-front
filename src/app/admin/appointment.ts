export class Appointment {

  constructor(
    public time: string,
    public title: string,
    public firstName: string,
    public lastName: string,
    public phoneNumber: string,
    public email: string,
    public roomType: string,
    public notes: string
  ) {  }
}
