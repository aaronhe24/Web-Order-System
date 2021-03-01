

export interface CustomerLatlng {
  lat: number;
  lng: number;
}

export interface Delivery {
  distance: number;
  shipping_fee: string;
  discount: number;
  org_shipping_fee: number;
  service_fee: number;
  service_fee_desc: string;
  subtotal: number;
  expectant_ready_at: string;
  expectant_delivered_at: string;
  delivered_time_from: number;
  delivered_time_to: number;
  customer_latlng: CustomerLatlng;
}

export class Delivery{
  public distance = 0;
  public shipping_fee = '';
  public service_fee = 0;
  public service_fee_desc = '';
  public org_shipping_fee = 0;
  public expectant_ready_at = '';
  public expectant_delivered_at = '';
  public delivered_time_from = 0;
  public delivered_time_to = 0;
  public subtotal = 0;
  public customer_latlng = {
    lat: 0,
    lng: 0
  }
}
