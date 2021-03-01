export interface StripeCharge {
  source:string
  amount: number, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
  description: string // opt
}

export interface Charge {
  address: string
  mid: string
  order_id:string
  token: string, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
  // cvc: string // opt
}
