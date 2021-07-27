import { CreditCard } from "./credit-card";
import { AppointmentSlot } from "./appointment";

export class User {

  constructor(
    public id: number,
    public email: string,
    public title: string,
    public firstName: string,
    public lastName: string,
    public countryCode: string,
    public phoneNumber: string,
    public addressLine1: string,
    public addressLine2: string,
    public city: string,
    public stateCode: string,
    public postalCode: string,
    public notes: string,
    public admin: boolean,
    public member: boolean,
    public membershipPlan: string,
    public membershipExpirationDate: string,
    public membershipAutoRenewalEnabled: boolean,
    public defaultCard: CreditCard,
    public currentAppointment: AppointmentSlot
  ) {  }

}
