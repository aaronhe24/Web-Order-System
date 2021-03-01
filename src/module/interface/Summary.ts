export interface Summary {
  subtotal: number;
  subtotal_tax: number;
  org_subtotal: number;
  org_subtotal_tax: number;
  shipping_fee: number;
  shipping_tax: number;
  org_shipping_fee: number;
  org_shipping_tax: number;
  service_fee: number;
  service_fee_desc: string;
  distance: number;
  tax: number;
  grand_total: number;
  discount: number;
  coupon_count: number;
  membership_desc: string;
  product_gift: string;
  discount_desc: string;
}
