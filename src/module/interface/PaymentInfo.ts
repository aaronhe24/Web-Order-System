import {Delivery} from "@/module/respones/Delivery";
import {DiscountGroup} from "@/module/interface/Coupon";

export interface PaymentInfoParams {
  subtotal:number;
  org_subtotal: number;
  shippingInfo: Delivery;
  tips: number;
  paymentFee: number;
  serviceFee: number;
  taxFee: number;
  total: number;
  totalWithoutTips: number;
  discount: number;
  deliveryType: string;
  cart_id: string;
  placeInfo: PaymentInfo;
  discountGroup: DiscountGroup;

}
export interface PlaceInfo {
  check_price: number
  codes: string
  error: string
  status: number
}

export class PlaceInfo {
  public check_price = 0
  public codes = ""
  public error = ""
  public status = 0
}


export class PaymentInfo{
  public subtotal = 0;
  public org_subtotal = 0;
  public shippingInfo = new Delivery();
  public tips = 0;
  public paymentFee = 0;
  public serviceFee = 0;
  public taxFee = 0;
  public grand_total = 0;
  public discount = 0
  public totalWithoutTips = 0;
  public deliveryType = "";
  public cart_id ="";
  public placeInfo = new PlaceInfo();
  public serviceFeeDesc = ""
  public discountGroup = new DiscountGroup();
  public get total()
  {
      return Math.round((this.grand_total + this.paymentFee + this.tips) * 100)/100;
  }
}
