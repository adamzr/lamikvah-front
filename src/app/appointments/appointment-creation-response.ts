import { AppointmentSlot } from "../profile/appointment";

export class AppointmentCreationResponse {

  constructor(
    public slot: AppointmentSlot,
    public message: string
  ) {  }

}
