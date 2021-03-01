export interface Shop {
  brand_id: number;
  mid: number;
  segment_id: number;
  name: string;
  thumb: string;
  thumb_small: string;
  preview_img: string;
  city: string;
  addr: string;
  tel: string;
  tax_rate: number;
  shipping_base_fee: string;
  lat: number;
  lon: number;
  distance: number;
  open: number;
  cooking_minutes: number;
  hours: string;
  online_payment: number;
  style_id: number;
  is_choice: number;
  is_preorder: number;
  supported_payment_methods: string[];
  customer_pickup: number;
  tags: any[];
  service_tip: number;
  min_amount: number;
  biz_circle_name: string;
  data: Data;
  today_open_time: string;
  has_promotion: number;
}

interface Data {
  autoOpenCloseTime: any[];
}
