import {ApiHelper} from "@/api/ApiHelper";
import {City, CityCategory} from "@/module/interface/City";

export class HomeLogic {

  private apiHelper = ApiHelper.getInstance();
  private static homeLogic: HomeLogic;
  private cities!:City[]
  private cityCategoryList!:CityCategory[]

  public static getInstance() {
    if (!this.homeLogic) {
      this.homeLogic = new HomeLogic();
    }
    return this.homeLogic;
  }

  public async fetchAreaList(){
    try {
      const response = await this.apiHelper.getCityList()
      this.cities = response.data.data
    }
    catch (e) {
      console.log(e)
    }
  }

  public getCityInfoList(){
    return this.cities
  }

  public getCityCategoryList(){
    this.cityCategoryList = this.cities.map( city => {
      return {
        id: city.id,
        name: city.name,
        lat:0,
        lng:0,
      }
    })
    return this.cityCategoryList
  }

}
