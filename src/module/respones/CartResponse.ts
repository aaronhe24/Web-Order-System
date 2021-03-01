import {Summary} from "@/module/interface/Summary";
import {Delivery} from "@/module/respones/Delivery";
import {PlaceInfo} from "@/module/interface/PaymentInfo";
import {DiscountGroup} from "@/module/interface/Coupon";


export interface CartResponse {
  cart_id: string;
  time: number;
  customer_id: number;
  summary: Summary;
  delivery: Delivery;
  discount: DiscountGroup;
  menu: Menu[];
  payment_types: PaymentType[];
  place: PlaceInfo;
}


  export interface CustomerLatlng {
    lat: number;
    lng: number;
  }

  export interface Options {
    discount_message: string;
    discount_tag: string;
  }

  export interface Coupon {
    id: number;
    customer_id: number;
    code_type: string;
    external_code: string;
    code: string;
    discount_type: string;
    amount: number;
    event: string;
    options: Options;
    start_date: string;
    end_date: string;
    shop_id: number;
    shop_ids: string;
    limit_times: number;
    invite_cid: number;
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



  export interface Menu {
    product_id: number;
    product_name: string;
    product_image: string;
    product_desc: string;
    price: number;
    org_price: number;
    row_total: number;
    org_row_total: number;
    position: number;
    qty: number;
    note: string;
    options: any[];
  }

  export interface PaymentType {
    payment_type: string;
    payment_fee: number;
    title: string;
    desc: string;
  }

  // export interface PlaceInfo {
  //   status: number;
  //   error: string;
  //   codes: string;
  //   check_price: number;
  // }




