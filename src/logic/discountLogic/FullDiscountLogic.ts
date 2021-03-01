import {ShopFullDiscount} from "@/module/interface/ShopFullDiscount";
import {ShopDetail} from "@/module/interface/ShopDetail";
import {ApiHelper} from "@/api/ApiHelper";
import {AppHelpers} from "@/common/AppHelpers";

export class FullDiscountLogic {
  private static fullDiscount: FullDiscountLogic;
  // private shopDetail!: ShopDetail;
  private appHelper = AppHelpers.getInstance()


  public static getInstance() {
    if (!this.fullDiscount) {
      this.fullDiscount = new FullDiscountLogic()
    }
    return this.fullDiscount;
  }

  public checkShopFullDiscount(subTotal: number, sd: ShopDetail): {
    nextSaleAmount: number,
    nextFullAmount: number,
    nextGift: string,
    discount: number,
    gift: string,
  } {
    subTotal = subTotal * 100
    if (!this.hasShopFullDiscount(sd)) {
      return this.findDiscount({}, -1);
    }
    let that = this
    // @ts-ignore
    let fullDiscount = sd.data.discount_events?.shop_full_discount;
    // let copy = fullDiscount
    // @ts-ignore
    fullDiscount = this.sortFullDiscount(fullDiscount);
    // @ts-ignore
    fullDiscount = fullDiscount.filter(f => that.fullDiscountEnable(f, sd)); //取出开关没有打开的
    // @ts-ignore
    let discountOptions = fullDiscount.map(f => f.options)
    // @ts-ignore
    let discounts = fullDiscount.map(f => f.discount_amount);
    let fullAmounts = discountOptions.map(d => d.full_amount * 100);
    let gifts = discountOptions.map(d => d.gift_product);
    let hits = fullAmounts.map(f => subTotal >= f)
    //取最后一个返回值为true的index
    let index = hits.indexOf(false);


    const isLast = index === -1;
    const indexParams = isLast ? discounts.length - 1 : index - 1;
    const objParams = {
      "discounts": discounts,
      "gifts": gifts,
      "fullAmounts": fullAmounts,
      "subtotal": subTotal,
    }
    return this.findDiscount(objParams, indexParams)
  }

  //满减逻辑
  public hasShopFullDiscount(sd: ShopDetail): boolean {
    // @ts-ignore
    // @ts-ignore
    return sd.data && sd.data.discount_events
      // @ts-ignore
      && sd.data.discount_events.shop_full_discount
      // @ts-ignore
      && sd.data.discount_events.shop_full_discount.length > 0;
  }

  private findDiscount(obj: object, index: number): {
    nextSaleAmount: number,
    nextFullAmount: number,
    nextGift: string,
    discount: number,
    gift: string,
  }
  {
    // @ts-ignore
    const stillHasDiscount = obj.fullAmounts ? index < obj.fullAmounts.length - 1 : false
    // @ts-ignore
    let nextSaleAmount = 0
    let nextFullAmount = 0
    let nextGift = ''
    // @ts-ignore
    let  discount = obj.discounts[index] ?? 0
    // @ts-ignore
    let  gift = obj.gifts[index] ?? ""
    if (stillHasDiscount) {

      // @ts-ignore
      nextSaleAmount = this.appHelper.roundTowDecimalNumber(obj.discounts[index + 1])
      // @ts-ignore
      nextFullAmount = obj.fullAmounts[index + 1] / 100;
      // @ts-ignore
      nextGift = obj.gifts[index + 1]
    }
    return {
      nextSaleAmount: nextSaleAmount,
      nextFullAmount: nextFullAmount,
      nextGift: nextGift,
      discount: discount,
      gift: gift
    }
  }

  private sortFullDiscount(discount: ShopFullDiscount[]) {
    return discount.sort((a, b) => {
      return a.options.full_amount - b.options.full_amount
    })
  }

  public fullDiscountEnable(obj: ShopFullDiscount, sd: ShopDetail): boolean {
    if (!this.hasShopFullDiscount(sd)) {
      return false;
    }
    return obj.enabled === 1;
  }


}
