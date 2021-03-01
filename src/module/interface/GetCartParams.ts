export interface  GetCartParam {
  shop_id: number,
  address: string,
  subtotal: number,
  promo_codes: string,
  product_items: string,
  shipping_type: string,
}

export class GetCartParams {
  shop_id = 0
  address = ""
  subtotal = 0
  promo_codes =""
  product_items =""
  shipping_type =""
  auto_match = 0;
}
