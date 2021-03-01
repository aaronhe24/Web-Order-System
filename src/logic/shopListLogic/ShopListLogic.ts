import {ApiHelper} from "@/api/ApiHelper";
import {Shop} from "@/module/interface/Shop";

export class ShopListLogic {

  private apiHelper = ApiHelper.getInstance();
  private static shopListLogic: ShopListLogic;
  private shopList:Shop[] = [];
  private currentList:Shop[] = [];
  private data:Shop[] =[];
  private local_store:Shop[]=[];

  public static getInstance() {
    if (!this.shopListLogic) {
      this.shopListLogic = new ShopListLogic();
    }
    return this.shopListLogic;
  }

  public async fetchShopList(city_id:number,lat:number, lng:number, type:number, sort:string, offset:number, limit:number, fetchMore:boolean) {
    try {
      const response = await this.apiHelper.getShopListV2(city_id,lat,lng,type,sort,offset,limit)
      this.currentList = response.data.data.list
      if(fetchMore)
      {
        this.shopList = this.shopList.concat(this.currentList)
      }else{
        this.shopList = this.currentList
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  public async searchShop(area_id:number,search:string,shop_ids:string){
    try {
      const response = await this.apiHelper.getSearchedShopList(area_id,search,shop_ids)
      this.shopList = response.data.data.list
    }catch (e) {
      console.log(e)
    }
  }

//获取自动补全数据
  public async searchCityId(city_id:number) {
    try{
      //获取localstore中的数据
      let local_data =  localStorage.getItem(city_id +"_city_shop_lists");
      if(local_data == '' || local_data == null){
        const response = await this.apiHelper.getCity(city_id)
        let data= response.data.data.list
       localStorage.setItem(city_id +"_city_shop_lists",JSON.stringify(data));
      }
    }catch (e) {
      console.log(e)
    }
  }

  public getShopList(){
    return this.shopList
  }

  public getCurrentList(){
    return this.currentList
  }

  public getCityList(){
    return this.data
  }
}
