export interface FullDiscountOptions {
  platform_discount: number;
  merchant_discount: number;
  shop_name: string;
  shop_img: string;
  discount_tag: string;
  discount_desc: string;
  full_amount: number;
  gift_product: string;
}

export interface ShopFullDiscount {
  id: number;
  shop_id: number;
  shop_ids: string;
  discount_code: string;
  discount_amount: number;
  discount_type: string;
  event: string;
  enabled: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  batch_id: number;
  limit_times: number;
  use_type: string;
  festival_event_id: number;
  shipping_type: string;
  is_dailyonce: number;
  discount_group: string;
  options: FullDiscountOptions;
}
