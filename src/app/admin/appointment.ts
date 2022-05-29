export class Appointment {

  constructor(
    public id: number,
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
