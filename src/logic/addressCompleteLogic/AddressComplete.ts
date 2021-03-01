import {ApiHelper} from "@/api/ApiHelper";
import {AddressCompleteInfo} from "@/module/interface/AddressCompleteInfo";

export class AddressComplete {

  private apiHelper = ApiHelper.getInstance();
  private static addressComplete: AddressComplete;
  private addressResult:AddressCompleteInfo[] = [];
  private locatorAddress:string = ""

  public static getInstance() {
    if (!this.addressComplete) {
      this.addressComplete = new AddressComplete();
    }
    return this.addressComplete;
  }

  public async fetchAddressComplete(input: string,location: string) {
    try {
      const response = await this.apiHelper.getAddressAutoComplete(input,location)
      this.addressResult = response.data.data
    }
    catch (e) {
      console.log(e)
    }
  }

  //根据经纬度反查地址
  public async locateUserAddress(userLatLng:{lat:number,lng:number}) {
    try {
      const response = await this.apiHelper.getAddressFromLatLng(userLatLng)
      this.locatorAddress = response.data.data.address
      // console.log("aaaaaa",response.data.data.address)
    }
    catch (e) {
      console.log(e)
    }
  }

  public getLocatorAddress(){
    return this.locatorAddress
  }

  public getCompletedAddress(){
    return this.addressResult
  }

  public async checkAddressValid(address:string){
    try {
      const response = await this.apiHelper.checkAddressInCity(address)
      return response.data.data
    }
    catch (e) {
      console.log(e)
      return 0;
    }
  }
}
