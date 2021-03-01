import {ApiHelper} from "@/api/ApiHelper";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import {User} from "@/module/interface/User";
import {TestUserProfile} from "@/logic/userProfileLogic/TestUserProfile";
import {Contact} from "@/module/interface/Contact";

// User的抽象类
export abstract class BaseUserProfile {

  protected apiHelper = ApiHelper.getInstance();
  protected user!: User;

  //用于子类单例使用时的抽象类
  protected static currentUserProfile: BaseUserProfile;
  // @ts-ignore
  abstract static getInstance():any

  //普通用户和测试用户实现不同的login
  abstract login(phone_num: string, password: string, isAutoLogin: boolean): void;

  //用户登出
  public async logout() {
    try {
      await this.apiHelper.logout();
      //需要清空UserProfile
      this.user = new User()
    } catch (e) {
      alert(e)
    }
  }

  //用账号密码登录
  protected async directLogin(phone_num: string, password: string) {
    const userInfo = await this.apiHelper.login(phone_num, password);
    this.user = userInfo.data.data;
    this.setGlobalContact();

    //登录后赋值给全局User对象
    let u = User.initUser(this.user)
    return u;
  }

  protected setGlobalContact(){
    const contact = new Contact();
    contact.name = this.user.name
    contact.addr = this.user.address
    contact.tel = this.user.phone
    GlobalSettingPreference.getInstance().setContact(contact);
  }

  protected setUserAsGlobal(u:User, isAutoLogin: boolean, obj: object){
    if(isAutoLogin){
      // @ts-ignore
      u.password = obj.password;
      // @ts-ignore
      u.phone_num = obj.phone_num;
    }
    GlobalSettingPreference.getInstance().setUser(u);
  }

  protected getLoginParams(phone_num: string, password:string){
    return   {
      phone_num: phone_num,
      password: password,
    }
  }


}


