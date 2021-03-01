import {ApiHelper} from "@/api/ApiHelper";
import {ShopDetail} from "@/module/interface/ShopDetail";
import {SyncApiCart} from "@/logic/cart/SyncApiCart";

export class ShopDetailLogic {

  private apiHelper = ApiHelper.getInstance();
  private static shopDetail: ShopDetailLogic;
  private  shopDetailInfo!:ShopDetail;

  public static getInstance() {
    if (!this.shopDetail) {
      this.shopDetail = new ShopDetailLogic();
    }
    return this.shopDetail;
  }

  public async fetchShopDetail(mid:number){
    try {
      const response = await this.apiHelper.getShopDetail(mid)
      this.shopDetailInfo = response.data.data
    }
    catch (e) {
      console.log(e)
    }
  }

  public getShopDetail(){
    return this.shopDetailInfo
  }



}
