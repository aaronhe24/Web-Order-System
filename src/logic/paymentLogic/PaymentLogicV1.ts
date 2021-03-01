import {BasePaymentLogic} from "@/logic/paymentLogic/BasePaymentLogic";
import {Charge, StripeCharge} from "@/module/interface/StripeCharge";
import {StripeCardToken} from "@/module/interface/StripeCardToken";

export class PaymentLogicV1 extends BasePaymentLogic{




  public static getInstance(){
    if(!this.paymentLogic){
      this.paymentLogic = new PaymentLogicV1();
    }
    return this.paymentLogic
  }

  //创建stripe token
  public tokenCreated(token: StripeCardToken, amount: number, charge: Charge){
    this.token = token;
    // for additional charge objects go to https://stripe.com/docs/api/charges/object
    // @ts-ignore
    // this.charge = {
    //   source: token.id,
    //   amount: amount, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
    //   description: this.description // optional description that will show up on stripe when looking at payments
    // }
    this.charge = charge
    this.charge.token = this.token.id
  }
















}
