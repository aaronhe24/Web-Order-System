import Stripe, {charges} from "stripe";
import {ApiHelper} from "@/api/ApiHelper";
import {StripeCardToken} from "@/module/interface/StripeCardToken";
import {Charge, StripeCharge} from "@/module/interface/StripeCharge";
import {CalShippingParams} from "@/module/interface/CalShippingParams";
import {Delivery} from "@/module/respones/Delivery";
import {SyncApiCart} from "@/logic/cart/SyncApiCart";
import {PlaceOrderParams} from "@/module/interface/PlaceOrderParams";
import {AppHelpers} from "@/common/AppHelpers";
import {PaymentType} from "@/module/respones/CartResponse";
import { PaymentTypeEnum } from '@/module/enum/PaymentTypeEnum';
import {PaymentInfo} from "@/module/interface/PaymentInfo";

export abstract class BasePaymentLogic {
  protected static paymentLogic: any;
  protected apiHelper: ApiHelper = ApiHelper.getInstance();
  protected token!: StripeCardToken;
  protected stripeCharge!: StripeCharge;
  protected charge!: Charge;
  protected description: string = ""
  protected shippingFeeInfo!: Delivery;
  protected order: PlaceOrderParams = new PlaceOrderParams();
  protected helper: AppHelpers = AppHelpers.getInstance();
  private prePaymentFee = 0;
  private preServiceFee = 0;



  /**
   * 向服务器传递charge请求
   * @param charge
   */
   public async createCharge(){
     if(!this.charge){
       return;
     }
     try {
       const response = await this.apiHelper.creatCharge(this.charge);
       return response.data;
     }catch (e) {
       console.log(e)
       return e;
     }

   }

   // public async calculateShippingFee(params: CalShippingParams){
   //   try {
   //     const response = await this.apiHelper.calculateShippingFee(params)
   //     this.shippingFeeInfo = response.data.data;
   //     console.log(JSON.stringify(this.shippingFeeInfo))
   //     return this.shippingFeeInfo;
   //   }catch (e) {
   //     return e;
   //   }
   //
   // }

   public getOrder(): PlaceOrderParams{
     return this.order
   }

   public setOrder(o:PlaceOrderParams){
     this.order = o;
   }

   public calTips(percent: number, subtotal: number): number{
      return this.helper.roundTowDecimalNumber(subtotal * percent /100);
   }
   /* 弃用 By Ln 2021-1-1
   public calTotal(info: PaymentInfo): number{

     // var fees = [];
     // fees.push(info.subtotal);
     // fees.push(info.tips);
     // if(info.shippingInfo && info.shippingInfo.distance){
     //   fees.push(parseFloat(info.shippingInfo.shipping_fee));
     // }
     // fees.push(info.paymentFee);
     // fees.push(info.taxFee);


     // return this.helper.roundTowDecimalNumber(this.helper.sum(fees))

     // let t  = info.total - this.prePaymentFee - this.preServiceFee
     //   + info.paymentFee + info.serviceFee;
     let t  = info.grand_total + info.paymentFee + info.tips;
     // this.prePaymentFee = info.paymentFee;
     // this.preServiceFee = info.serviceFee
     return  t;

   }
   */

   public calTax(percent: number): number{
     return this.helper.roundTowDecimalNumber(percent *
       (this.order.subtotal + this.order.shipping_fee) /100)
   }

   public async placeOrder(){
       const response = await this.apiHelper.placeOrder(this.order)
       return  response.data;
   }


   public sortPaymentFee(array: PaymentType[]){
     return  array.filter(a=>
       // @ts-ignore
      a.payment_type !== PaymentTypeEnum.OnlinePay || a.payment_type !== PaymentTypeEnum.Cash
     )
   }









}
