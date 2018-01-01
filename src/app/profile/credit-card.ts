export class CreditCard {

  constructor(
    public brand: string,
    public last4: string,
    public tokenId: string,
    public expirationMonth: number,
    public expirationYear: number
  ) {  }

}
