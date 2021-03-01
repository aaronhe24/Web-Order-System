import {User} from "@/module/interface/User";
import {Product} from "@/module/Product";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import {Contact} from "@/module/interface/Contact";

export interface PlaceOrderParams {
  shop_id: number
  shipping_fee: number
  shipping_distance: number
  contact: Contact | string
  items: string
  comment: string
//order_type:preorder
//preorder_date:2018-03-31
//preorder_time:9:30 - 10:30
//pin_id:10
  //express_id:19
  shipping_type: string
  payment_type: string
  subtotal: number
  promotion_code: string
  tips_amount: number
  discount_product_ids: number[]
  //非必要上传
  payment_fee: number;
  service_fee: number;
  tax_fee: number;
  tax_rate: number;
  cart_id: string;

}

export class PlaceOrderParams {
  public shop_id = 0
  public shipping_fee = 0
  public shipping_distance = 0
  public contact: Contact|string = GlobalSettingPreference.getInstance().getContact();
  public items = ""
  public comment = ""
//order_type:preorder
//preorder_date:2018-03-31
//preorder_time:9:30 - 10:30
//pin_id:10
  public shipping_type = ""
  public payment_type = ""
  public subtotal = 0
  promotion_code = ""
  public tips_amount = 0
  public discount_product_ids: number[] = []
  //非必要上传
  public payment_fee = 0;
  public service_fee = 0;
  public tax_fee  = 0;
  public tax_rate  = 0;
  public cart_id = "";
}
