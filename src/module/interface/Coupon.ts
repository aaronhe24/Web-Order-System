import {CouponType} from "@/module/enum/CouponType";
import {coupons} from "stripe";

export interface Coupon {
  id: number;
  customer_id: number;
  code_type: string;
  external_code: string;
  code: string;
  discount_type: string;
  amount: string;
  event: string;
  options: Options;
  start_date: string;
  end_date: string;
  shop_id: number;
  shop_ids: string;
  limit_times: number;
  invite_cid: number;
  valid_products: any[];
  title: string;
  discount_desc: string;
  rule_desc: string;
  code_img: string;
  used: number;
  use_type: string;
  actual_amount: number;
  amount_desc: string;
  festival_event_id: number;
  shipping_type: string;
  is_dailyonce: number;
  discount_group: string;
}

export class Coupon{
  id = 0
  customer_id = 0;
  code_type = "";
  external_code = "";
  code = ""
  discount_type = "";
  amount ="";
  event = ""
  options = new Options()
  start_date = ""
  end_date =""
  shop_id = 0;
  shop_ids = ""
  limit_times = 0;
  invite_cid = 0;
  valid_products: any[] = []
  discount_desc = ""
  rule_desc = ""
  code_img = ""
  used = 0
  use_type = ""
  actual_amount = 0
  amount_desc = ""
  festival_event_id = 0;
  shipping_type = ""
  is_dailyonce = 0
  discount_group = ""
  error = ""
}


export interface Options {
  platform_discount: number;
  merchant_discount: number;
}

export class Options {
  platform_discount = 0;
  merchant_discount =0;
}

export interface CouponValidation {
  [index: string]: any;
  shop_id: number;
  auto_match: number;
  product_items: string;
  shipping_type: string;
  subtotal: number;
  promo_codes: string;
}

export interface CouponValidationProduct {
  product_id: number;
  options: any[];
  note: string;
  qty: number;
  row_total: number;
}

export interface CouponListElement {
  discount_group: CouponType,
  desc: string,
  coupons: Coupon[]
}

export interface ValidationResult {
  discount: DiscountGroup
}


export class DiscountGroup {
  internal_discount: Discount[] = []
  normal_discount : Discount[] = []
  member_discount : Discount[] = []
  overlap_discount : Discount[] = []

  public static iniDiscount(d: DiscountGroup) {
    let dis = new DiscountGroup()
    dis.internal_discount = this.initD(d.internal_discount)
    dis.normal_discount = this.initD(d.normal_discount)
    dis.member_discount = this.initD(d.member_discount)
    dis.overlap_discount = this.initD(d.overlap_discount)
    return dis
  }

  private static initD(d: Discount[]): Discount[]{
    if(!d){
      return []
    }
    return d.map(ds=> Discount.initDiscount(ds));
  }

  public hasInternalDiscount(){
    return this.internal_discount && this.internal_discount.length > 0;
  }

  public hasNormalDiscount(){
    return this.normal_discount && this.normal_discount.length > 0;
  }

  public hasMemberDiscount(){
    return this.member_discount && this.member_discount.length > 0;
  }

  public hasOverLapDiscount(){
    return this.overlap_discount && this.overlap_discount.length > 0;
  }



}

export class ValidationResult{
   public discount = new DiscountGroup();
}

export interface CouponResult {
  coupon: Coupon;
}


export interface Discount {
  amount_desc: string;
  coupon: Coupon;
  desc:string;
  discount:number;
  error:string;
  event: string;
  selected: number;
  type: string;
  valid:number
}

export class Discount {
  amount_desc = ""
  coupon = new Coupon()
  desc = ""
  discount = 0;
  error = ""
  event = ""
  selected = 0;
  type = ""
  valid = 0;

  public static initDiscount(obj:Discount){
    let d = new Discount();
    d.amount_desc = obj.amount_desc;
    d.desc = obj.desc;
    d.coupon = obj.coupon || new Coupon();
    d.discount = obj.discount;
    d.error = obj.error;
    d.event = obj.event;
    d.selected = obj.selected;
    d.type = obj.type;
    d.valid = obj.valid;
    return d;
  }

  getDiscountGroupImg() {
    switch (this.coupon.discount_group) {
      case CouponType.INTERNAL_DISCOUNT:
        return internal_discount_img;
      case CouponType.NORMAL_DISCOUNT:
        return normal_discount_img;
      case CouponType.MEMBER_DISCOUNT:
        return member_discount_img;
      case CouponType.OVERLAP_DISCOUNT:
        return overlap_discount_img;
    }
  }
}

const internal_discount_img = require('@/assets/CouponListIcons/internal_discount.png');
const normal_discount_img = require('@/assets/CouponListIcons/normal_discount.png');
const member_discount_img = require('@/assets/CouponListIcons/member_discount.png');
const overlap_discount_img = require('@/assets/CouponListIcons/overlap_discount.png');

export function getDiscountGroupImg(discount_group: string) {
  switch (discount_group) {
    case CouponType.INTERNAL_DISCOUNT:
      return internal_discount_img;
    case CouponType.NORMAL_DISCOUNT:
      return normal_discount_img;
    case CouponType.MEMBER_DISCOUNT:
      return member_discount_img;
    case CouponType.OVERLAP_DISCOUNT:
      return  overlap_discount_img;
  }
}
