export interface Order {
  shop_id: number
  shipping_fee: number;
  shipping_distance: number;
  contact: string;
  items: string;
  comment: string;
  order_type?: string;
  preorder_date?: string;
  preorder_time?: string;
  pin_id?:string;
  shipping_type: string;
  payment_type: string;
  subtotal: number;
  promotion_code: string;
  tips: number;
  discount_product_ids: string;
  express_id?: number;
}

export function createOrder() {
   return {
         comment: "",
         contact: "",
         discount_product_ids: "",
         items: "",
         payment_type: "",
         promotion_code: "",
         shipping_distance: 0,
         shipping_fee: 0,
         shipping_type: "",
         shop_id: 0,
         subtotal: 0,
         tips: 0,
   }
}
