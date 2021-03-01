import {Service} from "@/api/Service";
import {User} from "@/module/interface/User";
import {ENV} from "@/module/enum/ENV";
import {getLocalStorage} from "@/common/settingTools";
import {CityCategory} from "@/module/interface/City";
import {Contact} from "@/module/interface/Contact";

export class GlobalSettingPreference {

  private static instance: GlobalSettingPreference;
  public baseUrl: string = Service.RELEASE;
  public env: string = ENV.LOCAL_DEV;
  private user: User = new User();
  private contact!:Contact;
  //记录用户在地址输入框选择的地址
  private address:string = ""
  private cityId:number = 0
  private userLatLng:{lat:number,lng:number} = {lat:0,lng:0}
  //用户的导航栏地址列表
  private addressCategory:CityCategory[] = []

  private isDev(){
    // return  window.location.href.includes(ENV.LOCAL_DEV) || window.location.href.includes("8080/")
    //   || window.location.href.includes("8081/") || window.location.href.includes(ENV.TEST_DEV); // 上线应用
    return false;   //正式
    // return true;    //测试
  }

  private constructor() {
    this.initUser();
  }

  //测试用户名单，无需接验证码
  public testGroup:{phone_num:string,password:string}[] = [
    {
      phone_num:'6479891678',
      password: this.isDev() ? 'cfb326cd57' : '049054a56b'
    },
  ]

  public setContact(c: Contact){
    this.contact = c
    this.setContactSession(c);
  }

  public setContactSession(c: Contact){
    window.localStorage.setItem('contact', JSON.stringify(c));
  }

  public getContact(): Contact{
    if(!this.contact){
      //如果没有信息，默认读取 user
      this.contact = new Contact();
      this.contact.name = this.user.name;
      this.contact.tel = this.user.phone;
      this.contact.addr = this.user.address;
    }
    return this.contact
  }

  public static getInstance(){
    if(!this.instance){
      this.instance = new GlobalSettingPreference();
    }
    return this.instance;
  }

  public getUser() {
    return this.user
  }

  public isLogin(): boolean{
    return !!this.getUser().token
  }


  public getUserLatLng(){
    return this.userLatLng
  }


  public getAddressInfo() {
    const address = this.address
    const cityId = this.cityId
    return {
      address,
      cityId
    }
  }

  public getAddressCategory() {
    return this.addressCategory
  }

  protected initUser() {
    const sessionUser = getLocalStorage().sessionUser
    const sessionAddress = getLocalStorage().sessionAddress
    const sessionCityId = getLocalStorage().sessionCityId
    const sessionAddressCategory = getLocalStorage().sessionAddressCategory
    const sessionLatLng = getLocalStorage().sessionLatLng
    const sessionContact = getLocalStorage().sessionContact

    this.user = sessionUser
      ? User.initUser(JSON.parse(sessionUser)) // 有缓存User就用缓存User
      : new User();           // 无缓存就创建一个空User

    this.address = sessionAddress
      ? JSON.parse(sessionAddress)
      : ""

    this.cityId = sessionCityId
      ? JSON.parse(sessionCityId)
      : 0

    this.addressCategory = sessionAddressCategory
      ? JSON.parse(sessionAddressCategory)
      : []

    this.userLatLng = sessionLatLng
      ? JSON.parse(sessionLatLng)
      : {lat: 0, lng: 0}

    this.contact = sessionContact
      ? JSON.parse(sessionContact)
      : new Contact()
  }



  public setUser(user: User) {
    this.user = user;}

  public clearUser() {
    this.user = new User()
    this.address = ""
    this.cityId = 0
    this.userLatLng = {lat:0,lng:0}
  }

  public setUserSession(user: User) {
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  public clearUserSession(){
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('address')
    window.localStorage.removeItem('city_id')
    window.localStorage.removeItem('address_category')
    window.localStorage.removeItem('user_latlng')
    window.localStorage.removeItem('shopping_cart')
    window.localStorage.removeItem('contact')
  }

  public setUserAddressInfo(address:string,city_id:number){
      this.address = address
      this.cityId = city_id
  }

  public setUserAddressSession(address:string,city_id:number){
    window.localStorage.setItem('address', JSON.stringify(address));
    window.localStorage.setItem('city_id', JSON.stringify(city_id));
  }

  public setUserAddressListSession(addressList:CityCategory[]){
    window.localStorage.setItem('address_category', JSON.stringify(addressList));
  }

  public setUserLatLng(lat:number,lng:number){
    this.userLatLng.lat = lat
    this.userLatLng.lng = lng
  }

  public setUserLatLngSession(lat:number,lng:number){
    window.localStorage.setItem('user_latlng', JSON.stringify({lat:lat,lng:lng}));
  }

}






