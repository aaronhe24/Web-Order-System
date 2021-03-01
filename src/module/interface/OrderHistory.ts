export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  qty: number;
  note: string;
  options: any[];
  product_image: string;
}

export interface Service {
  can_review: number;
}

export interface Customer {
  can_review: number;
}

export interface Shop {
  can_review: number;
}

export interface Rating {
  service: Service;
  customer: Customer;
  shop: Shop;
}

export interface RedeemInfo {
  qrcode_url: string;
  expire_date: string;
}

export interface OrderHistory {
  status: number;
  order_id: number;
  order_tax: number;
  order_total: number;
  order_time: string;
  order_subtotal: number;
  order_discount: number;
  order_items: OrderItem[];
  order_qty: number;
  shipping_fee: number;
  shop_id: number;
  shop_name: string;
  shop_tel: string;
  is_rating: number;
  hurryup: number;
  segment_id: number;
  tips_rate: number;
  tips_amount: number;
  logs: any[];
  coupon_logs: any[];
  payment_type: string;
  payment_fee: number;
  order_type: string;
  preorder_info: string;
  shipping_type: string;
  gift: string;
  service_fee: number;
  only_shipping_fee: number;
  service_fee_desc: string;
  membership_fee: string;
  payment_gateway: string;
  is_pin: number;
  shop_thumb: string;
  customer_addr: string;
  customer_lat: string;
  customer_lng: string;
  customer_tel: string;
  customer_note: string;
  shop_addr: string;
  shop_lat: string;
  shop_lng: string;
  rating: Rating;
  express_id: number;
  redeem_info: RedeemInfo;
  payment_status: number;
}
