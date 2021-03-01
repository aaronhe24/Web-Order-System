export class ProductDiscountLogic {
  private static productDiscount: ProductDiscountLogic;

  public static getInstance(){
    if(!this.productDiscount){
      this.productDiscount = new ProductDiscountLogic()
    }
    return this.productDiscount;
  }



}
