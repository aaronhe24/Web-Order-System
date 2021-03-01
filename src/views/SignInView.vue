<template>
  <div>

    <div class="header">
      <div>
        <router-link to="/"><img src="../assets/icon_facedrive_foods_main@2x.png" style="height: 30px; width: 125px" alt=""></router-link>
      </div>
      <div>
        <button class="download-btn" style="margin-top: 8px">
          <a href="https://www.facedrive-foods.com/download" target="_blank"
             style="text-decoration: none; color: var(--dark-gray)">
            <img style="margin: 0px 5px 0px 0px" src="../assets/SignInIcons/icon_phone.png" alt="" class="icon">
            {{$t('common.download_app')}}</a>
        </button>
      </div>
    </div>

    <div class="sign-up-container">
      <img src="../assets/icon_facedrive_foods_main@2x.png" style="height: 30px; width: 125px" alt="">
      <div style="margin-top: 30px">

        <b-input-group>
          <b-input-group-prepend>
            <b-input-group-text>
              <img src="../assets/SignInIcons/icon_phone@2x.png" class="icon">
            </b-input-group-text>
          </b-input-group-prepend>
          <b-form-input :placeholder="$t('common.phone')"
                        v-model="phoneNumber" type="tel" :state="phoneStatus" :formatter="formatPhone">
          </b-form-input>
        </b-input-group>

        <br>
        <div style="display: flex; flex-direction: row;">
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text>
                <img src="../assets/SignInIcons/icon_code@2x.png" class="icon">
              </b-input-group-text>
            </b-input-group-prepend>
            <b-form-input class="w-50 mr-4"
                          :placeholder="$t('common.verification_code')"
                          v-model="code" :formatter="formatCode">
              <img src="../assets/SignInIcons/icon_code.png" alt="">
            </b-form-input>
          </b-input-group>

          <b-button class="w-50"
                    :class="resendStatus ? 'red-btn' : 'grey-btn'" type="submit"
                    :disabled="resendStatus ? null : true"
                    @click="this.sendCode">
            {{resendStatus ? $t('common.get_code') : codeBtnText}}
          </b-button>
        </div>

      </div>

      <br>

      <b-button block
                :disabled="tester || (phoneStatus && code) ? null : true"
                :class="phoneStatus && code  ? 'red-btn' : 'grey-btn'"
                type="submit" @click="this.login">
        {{$t('common.login_label')}}
      </b-button>

      <div class="login-cell">
        <b-button id="'check-auto-login'" class="qty-button"
                  @click="onPressAutoLogin"
        >
          <img v-if="isCheckedAutoLogin" src="../assets/product/icon_checkbox.png" alt="">
          <img v-if="!isCheckedAutoLogin" src="../assets/product/icon_checkBox_gray.png" alt="">
        </b-button>
        <div class="auto-login-text">{{$t('common.remember_me')}}</div>
      </div>
    </div>
    <MaskLoading :isShow="isLoading"/>
  </div>

</template>

<script lang="ts">

  import {Component, Vue, Watch} from 'vue-property-decorator'
  import {UserProfile} from "@/logic/userProfileLogic/UserProfile";
  import {TestUserProfile} from "@/logic/userProfileLogic/TestUserProfile";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  import MaskLoading from "@/components/baseComponents/MaskLoading.vue";

  let watch = Watch;
  @Component({
    components: {MaskLoading}
  })
  export default class SignInView extends Vue {
    private RESEND_LIMIT = 60
    private currentUserProfile: any = UserProfile.getInstance();
    private globalSettings = GlobalSettingPreference.getInstance()
    private phoneNumber: string = "";
    private phoneStatus: any = null;

    private code: string = "";
    private resendStatus: boolean = true;
    private codeBtnText: number = this.RESEND_LIMIT;
    private isCheckedAutoLogin = false;
    private isLoading = false;
    private tester: { phone_num: string; password: string; } | undefined = {phone_num: '', password: ''};

    mounted() {
      //将页面重置到顶部
      window.scrollTo(0, 0);
      if (!this.isAutoLogin()) {
        return
      }
      this.autoLogin();
    }

    async autoLogin() {
      let phone_num = this.globalSettings.getUser().phone_num;
      let passWord = this.globalSettings.getUser().password
      this.isLoading = true
      try {
        await this.currentUserProfile.directLogin(phone_num, passWord)
        this.isLoading = false
        if (this.globalSettings.getUser().token) {
          this.saveUserData()
          this.$router.go(-2);
        } else {
          alert(this.$t('common.code_error'))
        }
      } catch (e) {
        alert(this.$t('common.incomplete_error'))
        this.isLoading = false;
      }

    }

    isAutoLogin() {
      return this.globalSettings.getUser().isAutoLogin()
    }

    //验证手机号码合法性
    @Watch('phoneNumber') checkStatus(oldValue: string, newValue: string) {
      let phone = this.restorePhone(this.phoneNumber)
      this.tester = this.globalSettings.testGroup.find(isTest => {
        return isTest.phone_num === phone
      })
      if (phone.length !== 10 || this.phoneNumber.length !== 13) {
        if (this.phoneNumber.length === 0) {
          this.phoneStatus = null
        } else {
          this.phoneStatus = false
        }
      } else {
        this.phoneStatus = true
      }
    }

    //格式化电话号码
    formatPhone(e: string) {
      return e.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
    }

    //恢复电话号码
    restorePhone(phone: string) {
      return phone.replace(/[^\d]/g, "");
    }

    //格式化验证码，限制4位
    formatCode(e: string) {
      return e.substring(0, 4)
    }

    //发送验证码
    sendCode() {
      if (this.phoneStatus === true) {
        let phone = this.restorePhone(this.phoneNumber)
        this.startResendTimer(this.RESEND_LIMIT)
        this.resendStatus = false
        this.currentUserProfile.sentCode(phone)
      } else {
        alert(this.$t('common.phone_type_error'))
      }
    }

    //用户登录
    login() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true
      let _phone = this.restorePhone(this.phoneNumber)
      if (this.checkIsTesterPhone(_phone)) {
        this.currentUserProfile = TestUserProfile.getInstance()
        this.code = "TEST"
      }
      let _password = this.tester ? this.tester.password : this.code

      //当前用户登录（测试/普通用户）
      if (this.phoneStatus === true) {
        this.currentUserProfile.login(_phone, _password, this.isCheckedAutoLogin).then(() => {
            this.afterLogin()
            this.isLoading = false
          }
        ).catch((e: any) => {
          console.log(e)
          this.isLoading = false
        })
      } else {
        this.isLoading = false
        alert(this.$t('common.incomplete_error'))
      }

    }

    afterLogin() {
      if (this.globalSettings.getUser().token) {
        this.saveUserData()
        this.$router.go(-2);
      } else {
        alert(this.$t('common.code_error'))
      }
    }

    //检查是否为测试人员电话
    checkIsTesterPhone(phone: string) {
      this.tester = this.globalSettings.testGroup.find(isTest => {
        return isTest.phone_num === phone
      })
      return this.tester
    }

    //记录登录信息并跳转
    saveUserData() {
      this.globalSettings.setUserSession(this.globalSettings.getUser())
      this.$emit('logged', this.globalSettings.getUser())
      this.$router.push('/')
    }

    //重新发送code的计时器
    startResendTimer(remainingTime: number) {
      if (this.isLoading) {
        return;
      }
      const timer = setInterval(() => {
        remainingTime -= 1
        this.codeBtnText = remainingTime
        // console.log("remaining: ",remainingTime)
        if (remainingTime < 1) {
          this.resendStatus = true
          clearInterval(timer)
        }
      }, 1000)
    }

    onPressAutoLogin() {
      this.isCheckedAutoLogin = !this.isCheckedAutoLogin
    }

  }

</script>

<style scoped>

  .sign-up-container {
    padding: 30px;
    margin: 60px auto auto auto;
    width: 360px;
    box-shadow: lightgrey 0px 0px 10px;
  }

  .qty-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    flex-direction: row;
    color: white;
    border: 0;
    width: 24px;
    height: 24px;
    padding: 0px;
    font-size: 15px;
    outline: 0;
    box-shadow: none !important;
  }

  .auto-login-text {
    margin-left: 15px;
    color: var(--dark-gray);
    font-size: 16px;
  }

  .login-cell {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .header {
    height: 80px;
    background-color: white;
    border-bottom: 1px solid lightgrey;
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header img {
    margin-left: 20px;
  }

  .header button {
    border: 1px solid lightgrey;
    background: white;
    border-radius: 5px;
    margin-right: 20px;
    height: 36px;
    font-family: var(--regular-font);
    font-size: 13px;
    padding-right: 10px;
  }

  .header button img {
    margin-left: 10px;
    margin-right: 10px;
  }

  .red-btn {
    border: none;
    background: var(--theme-red);
  }

  .grey-btn {
    border: none;
    background: var(--light-gray);
  }

  .icon {
    width: 18px;
  }

</style>
