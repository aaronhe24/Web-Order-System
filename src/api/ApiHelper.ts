import {Api} from "@/api/Api";
import axios from 'axios';
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import {ENV} from "@/module/enum/ENV";
import {Charge} from "@/module/interface/StripeCharge";
import {AddrBook, ExistedAddrBook} from "@/module/interface/AddrBook";
import {CalShippingParams} from "@/module/interface/CalShippingParams";
import {PlaceOrderParams} from "@/module/interface/PlaceOrderParams";
import {GetCartParam} from "@/module/interface/GetCartParams";
import {ShippingType} from "@/module/interface/ShippingType";
import {getLocalStorage} from "@/common/settingTools";

import {Locales} from "@/i18n/locales";
import {CouponValidation} from "@/module/interface/Coupon";
import {errors} from "stripe";


const GOOGLE_API_KEY = "AIzaSyD_F4WAaqMCybTmnUS_Ren99slMJyfgMS0"
// const GOOGLE_API_KEY = "AIzaSyA2wNIyUwA4dxKxRtiGd_oxUmL7IbjnxeM"

export class ApiHelper {
  private static apiHelper: ApiHelper;


  public static getInstance() {
    if (!this.apiHelper) {
      this.apiHelper = new ApiHelper();
      this.initBaseUrl();
    }
    return this.apiHelper;
  }

  private setHeader() {
    let value = GlobalSettingPreference.getInstance().getUser().additional_token.header_value
    value = value ? value : ''
    axios.defaults.headers = {
      "APP-LANGUAGE": getLocalStorage().defaultLocale,
      "FACEDRIVEFOODS-WEBCLIENT": value,
      "MOBILE-OS": "web",
      "Access-Control-Allow-Origin": "*"
    }
  }

  // private getHeader(){
  //   console.log("getHeader ++++++++")
  //   let value = GlobalSettingPreference.getInstance().getUser().additional_token.header_value
  //   value = value ? value : ''
  //   return  {
  //     "APP-LANGUAGE": getLocalStorage().defaultLocale,
  //     "FACEDRIVEFOODS-WEBCLIENT": value,
  //     "MOBILE-OS": "web",
  //     "Access-Control-Allow-Origin": "*"
  //   }
  // }

  public updateAxiosHeaderLang(lang: Locales) {
    axios.defaults.headers["APP-LANGUAGE"] = lang
  }

  private static initBaseUrl() {
    // if(!this.isLocalDev()){
    //   this.setBaseUrl(GlobalSettingPreference.getInstance().baseUrl)
    // }
    // this.setBaseUrl("/")

  }

  private static isLocalDev() {
    return GlobalSettingPreference.getInstance().env === ENV.LOCAL_DEV;
  }

  private static setBaseUrl(url: string) {
    axios.defaults.baseURL = url;
  }

  private async getRequest(api: string, params = {}) {
    this.setHeader();
    let response = await axios.get(api, {params: params});
    let status = response.status;
    let error = response.data.error ? response.data.error.toString() : "";
    if (status >= 400) {
      throw new Error(status.toString() + error)
    }
    return response;
  }

  // private async getRequest(api: string, params = {}) {
  //   // this.setHeader();
  //   let response = await axios(
  //     { method: 'get', url: api,
  //       headers:this.getHeader() });
  //   let status = response.status;
  //   let error = response.data.error ? response.data.error.toString() : "";
  //   if (status >= 400) {
  //     throw new Error(status.toString() + error)
  //   }
  //   return response;
  // }


  private async postRequest(api: string, body = {}) {
    this.setHeader();
    let response = await axios.post(api, body);
    let status = response.status;
    let error = response.data.error ? response.data.error.toString() : ""
    if (status >= 400) {
      throw new Error(status.toString() + error)
    }
    return response;
  }


  //登录接口
  public login(username: string, password: string) {
    let params = {
      "username": username,
      "password": password,
    }
    return this.postRequest(Api.Login, params);
  }

  //获取商户产品菜单
  getShopMenuCategory(mid: number, shipping_type: string) {
    const params = {
      "shop_id": mid,
      "shipping_type": shipping_type,
    }
    return this.getRequest(Api.MenuCategory, params)
  }

  public getAddressBook() {
    return this.getRequest(Api.USER_ADDR_BOOK_LIST);
  }

  public postNewAddressBook(addrBook: AddrBook) {
    return this.postRequest(Api.USER_ADDR_BOOK_ADD, addrBook);
  }

  public postUpdateAddressBook(addrBook: ExistedAddrBook) {
    return this.postRequest(Api.USER_ADDR_BOOK_UPDATE, addrBook);
  }

  public postDeleteAddressBook(id: number) {
    const params = {
      id: id
    }
    return this.postRequest(Api.USER_ADDR_BOOK_DELET, params);
  }

  public placeOrder(order: PlaceOrderParams) {
    return this.postRequest(Api.PlaceOrder, order);
  }

  public getOrderDetail(orderId: number) {
    const params = {
      "order_id": orderId
    }
    return this.getRequest(Api.OrderDetail, params);
  }

  public getOrderHistory() {
    const params = {
      "offset": 0,
      "limit": 50
    }
    return this.getRequest(Api.ORDER_HISTORY, params);
  }

  public logout() {
    return this.postRequest(Api.Logout);
  }

  public fetchCart(cartInfo: GetCartParam) {
    return this.postRequest(Api.CART_CALCULATE, cartInfo)
  }

  //发送手机验证码
  public sendVerifyCode(phone_num: string) {
    const params = {
      "phone_num": phone_num
    }
    return this.getRequest(Api.REQUEST_VERIFICODE, params);
  }

  //验证手机验证码
  public checkVerifyCode(phone_num: string, code: string) {
    let params = {
      "phone_num": phone_num,
      "code": code,
    }
    return this.postRequest(Api.CHECK_VERIFICODE, params);
  }

  //获取主页城市列表
  public getCityList() {
    return this.getRequest(Api.AREA_LIST);
  }

  //获取地址自动补全
  public getAddressAutoComplete(input: string, location: string) {
    let params = {
      "input": input,
      "components": "country:ca",
      "language": getLocalStorage().defaultLocale,
      "key": GOOGLE_API_KEY,
      "location": location,
    }
    return this.getRequest(Api.GOOGLE_PLACE_FULL_API, params)
  }

  //根据经纬度反查地址
  public getAddressFromLatLng(userLatLng: { lat: number, lng: number }) {
    let params = {
      "lat": userLatLng.lat,
      "lng": userLatLng.lng,
    }
    return this.getRequest(Api.LATLNG_TO_ADDRESS, params)
  }

  //判断城市地址合法性
  public checkAddressInCity(address: string) {
    let params = {
      "address": address
    }
    return this.getRequest(Api.USER_CUSTOMER_LATLNG, params)
  }

  //获取商户列表
  public getShopListV2(city_id: number, lat: number, lng: number, type: number, sort: string, offset: number, limit: number) {
    let params = {
      'city_id': city_id,
      'lat': lat,
      'lng': lng,
      'type': type,
      'sort': sort,
      'offset': offset,
      'limit': limit,
    }
    return this.getRequest(Api.SHOP_LIST, params)
  }

  //在线支付创建支付
  public creatCharge(charge: Charge) {

    let params = {
      "order_id": charge.order_id,
      "charge_token": charge.token,
      "mid": charge.mid,
      "address": charge.address
    }
    return this.postRequest(Api.ORDER_CREATE_CHARGE, params)
  }

  public calculateShippingFee(params: CalShippingParams) {
    const p = {
      "mid": params.mid,
      "address": params.address,
      "subtotal": params.subtotal,
      "express_id": params.express_id,
    }
    return this.postRequest(Api.CAL_SHIPPING_FEE, p)
  }

  public getSearchedShopList(area_id:number,search:string,shop_ids:string){
    let params = {
      'city_id':area_id,
      'keyword':search,
      'shop_ids':shop_ids,
      'offset':0,
      'limit':100,
      'lat': GlobalSettingPreference.getInstance().getUserLatLng().lat,
      'lng': GlobalSettingPreference.getInstance().getUserLatLng().lng,
    }
    return this.getRequest(Api.SHOP_SEARCH, params)
  }

  public getCity(city_id:number) {
    let params = {
      'city_id':city_id
    }
    return this.getRequest(Api.SHOP_CITY,params)
  }

  public getShopDetail(mid:number){
    let params = {
      'mid': mid,
    }
    return this.getRequest(Api.SHOP_DETATIL, params)
  }

  public validateCoupon(couponStr: string) {
    return this.postRequest(Api.PROMO_VLIDATE + '?' + couponStr);
  }

  public getCouponList(params: object) {
    return this.getRequest(Api.COUPON_LIST, params);
  }

  public validateLoginStatus() {
    return this.postRequest(Api.LoginChecking)
  }

  public getErrorMessage(s?: string): object {
    return {
      status: 0,
      error: s ? s : '',
      data: [],
    }
  }

  public sendReceiptRequest(order_id:number,email:string){
    const params ={
      "order_id": order_id,
      "email":email,
    }
    return this.postRequest(Api.SEND_RECEIPT, params)
  }
}


