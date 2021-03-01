export interface OrderDetail {
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
  logs: Log[];
  coupon_logs: string[];
  payment_type: string;
  payment_fee: number;
  order_type: string;
  preorder_info: string;
  shipping_type: string;
  gift: string;
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
  expectant_ready_at: string;
  expectant_delivered_at: string;
  current_inapp_gateway: string;
  current_card_gateway: string;
  service_fee: number;
  service_fee_desc: string;
  only_shipping_fee: number;

}

export interface Log {
  id: number;
  order_id: number;
  user_id: number;
  operator_id: number;
  operator_name: string;
  old_order_status: number;
  new_order_status: number;
  desc: string;
  created_at: number;
  updated_at: number;
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

export interface OrderItemOption {
  label: string;
  items: OptionItem[];
}

export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  qty: number;
  note: string;
  options: OrderItemOption[];
  product_image: string;
}

export interface OptionItem {
  name: string;
  price: number;
  qty: number;
}

export function getNewOrderDetail() {
  return {
    status: 0,
    order_id: 0,
    order_tax: 0,
    order_total: 0,
    order_time: '',
    order_subtotal: 0,
    order_discount: 0,
    order_items: [],
    order_qty: 0,
    shipping_fee: 0,
    shop_id: 0,
    shop_name: 0,
    shop_tel: 0,
    is_rating: 0,
    hurryup: 0,
    segment_id: 0,
    tips_rate: 0,
    tips_amount: 0,
    logs: [],
    coupon_logs: [],
    payment_type: '',
    payment_fee: 0,
    order_type: '',
    preorder_info: '',
    shipping_type: '',
    gift: '',
    payment_gateway: '',
    is_pin: 0,
    shop_thumb: '',
    customer_addr: '',
    customer_lat: '0',
    customer_lng: '0',
    customer_tel: '',
    customer_note: '',
    shop_addr: '',
    shop_lat: '0',
    service_fee: 0,
    service_fee_desc: '',
    only_shipping_fee:'',
    shop_lng: '0',
    rating: {
      service: {
        can_review: 0
      },
      customer: {
        can_review: 0
      },
      shop: {
        can_review: 0
      },
    },
    express_id: 0,
    redeem_info: {
      qrcode_url: '',
      expire_date: '',
    },
    payment_status: 0,
    expectant_ready_at: '',
    expectant_delivered_at: '',
    current_inapp_gateway: '',
    current_card_gateway: '',
  } as unknown as OrderDetail;
}

export function getOptionsString(orderItem: OrderItem): string[] {
  if (orderItem.options.length === 0) return [];
  else {
    return orderItem.options.map(option =>
      optionToString(option)
    );
  }
}

function optionToString(option: OrderItemOption): string {
  if(!hasItems(option.items)){
    return '';
  }
  let prefix = option.label + ": "
  let s = prefix + option.items.map(i=>{
    return  i.name + " * " + i.qty
  }).join(" ")
  return s === prefix ? "" : s;
}

function hasItems(optionItems: OptionItem[]):boolean{
  return optionItems.length > 0;
}
