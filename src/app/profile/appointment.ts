export class AppointmentSlot {

  constructor(
    public id: number,
    public start: string,
    public lastCancellation: string,
    public roomType: string,
  ) {  }

  getLastCancellationDate(): Date{
    return new Date(this.lastCancellation);
  }
}
