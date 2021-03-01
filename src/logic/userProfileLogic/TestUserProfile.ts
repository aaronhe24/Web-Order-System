import {BaseUserProfile} from "@/logic/userProfileLogic/BaseUserProfile";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";

export class TestUserProfile extends BaseUserProfile{

  public static getInstance():any{
    if(!this.currentUserProfile){
      this.currentUserProfile = new TestUserProfile();
    }
    return this.currentUserProfile;
  }

  //绕过发送验证码
  public sentCode(phone_num:string) {
    console.log("This is a tester, phone number: ", phone_num)
  }

  //测试用户不接验证码直接登录
  public async login(username:string,password:string, isAutoLogin: boolean) {
    try {
      let u = await this.directLogin(username, password);
      let o = super.getLoginParams(username, password)
      super.setUserAsGlobal(u, isAutoLogin, o)
    } catch (e) {
      alert(e)
    }
  }

  getInstance(): any {
  }

}
