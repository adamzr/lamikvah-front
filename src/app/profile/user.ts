import { CreditCard } from "./credit-card";
import { AppointmentSlot } from "./appointment";

export class User {

  constructor(
    public email: string,
    public title: string,
    public firstName: string,
    public lastName: string,
    public member: boolean,
    public defaultCard: CreditCard,
    public currentAppointment: AppointmentSlot
  ) {  }

}
