import {BaseUserProfile} from "@/logic/userProfileLogic/BaseUserProfile";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";

export class UserProfile extends BaseUserProfile {

  public static getInstance(){
    if(!this.currentUserProfile){
      this.currentUserProfile = new UserProfile();
    }
    return this.currentUserProfile;
  }

  //发送验证码
  public async sentCode(phone_num:string) {
    try {
      await this.apiHelper.sendVerifyCode(phone_num);
    } catch (e) {
      alert(e)
    }
  }

  public async directLogin(phone_num: string, password: string){
   return await super.directLogin(phone_num, password)
  }

  //正常登录，验证验证码并用返回密码直接登录
  public async login(phone_num:string,code:string, isAutoLogin: boolean) {
    try {
      const response = await this.apiHelper.checkVerifyCode(phone_num,code);
      const password = response.data.data.password
      if(password){
        let u = await this.directLogin(phone_num, password);
        let o = super.getLoginParams(phone_num, password)
        super.setUserAsGlobal(u, isAutoLogin, o)
      }
      // else{
      //   alert(response.data.error)
      // }
    } catch (e) {
      alert(e)
    }
  }

}
