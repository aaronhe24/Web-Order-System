import {ApiHelper} from "@/api/ApiHelper";
import {CouponListElement} from "@/module/interface/Coupon";
import {SyncApiCart} from "@/logic/cart/SyncApiCart";

export class CouponListLogic {
  private static couponListLogic: CouponListLogic;
  private apiHelper = ApiHelper.getInstance();
  private couponList: CouponListElement[] = [];

  public static getInstance() {
    if (!this.couponListLogic) {
      this.couponListLogic = new CouponListLogic();
    }
    return this.couponListLogic;
  }

  public async fetchCouponList(code: string, isMatchShop: boolean) {
    let params = {
      shop_id: isMatchShop ? SyncApiCart.getInstance().getShopId() : 0,
      promo_code: code
    };
    try {
      const response = await this.apiHelper.getCouponList(params);
      if (this.checkResState(response)) {
        return  response.data;
      } else {
        return [];
      }
    } catch (e) {
      return this.apiHelper.getErrorMessage(e)
    }
  }

  public getCouponList() {
    return this.couponList;
  }

  private checkResState(res: any): boolean {
    if (res.data.status === 0) {
      alert(res.data.error);
      return false;
    } else {
      return true;
    }
  }
}
