import {BaseCartLogic} from "@/logic/cart/BaseCartLogic";

export class SingleShopCart extends BaseCartLogic{
  protected static cart: SingleShopCart;
  public static getInstance(){
    if(!this.cart){
      this.cart = new SingleShopCart();
    }
    return this.cart;
  }



  /**
   * 新建购物车
   * @param shopId
   */
  public setUp(shopId: number){
    this.clear();
    this.cartId = shopId
  }

  // /**
  //  * `清楚购物车
  //  */
  // public clearCart(){
  //   this.cartId = 0;
  // }



}
