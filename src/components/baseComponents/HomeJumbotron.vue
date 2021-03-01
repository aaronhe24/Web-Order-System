<template>
  <div class="home-jumbotron">
    <b-jumbotron fluid>

      <div class="home-header">
        <div>
          <img src="../../assets/icon_facedrive_foods_main@2x.png" style="height: 30px; width: 125px" alt="">
        </div>
        <div style="display: flex;">
          <b-dropdown no-caret right variant="null">
            <template #button-content>
              <div class="lang-change">
                {{currentLocale.caption}}
                <img src="../../assets/HomeIcons/icon_arrow_down@2x.png" alt="" style="width: 10px;margin-left: 5px">
              </div>
            </template>
            <b-dropdown-item v-for="(o, i) in LOCALES"
                             :key="i"
                             :value="o.value"
                             v-on:click="changeLocale(o.value)">{{ o.caption }}
            </b-dropdown-item>
          </b-dropdown>

          <button id="download_btn">
            <a href="https://www.facedrive-foods.com/download" target="_blank" style="text-decoration: none; color: var(--dark-gray)">
              <img style="margin: 0px 5px 0px 5px" class="icon" src="../../assets/SignInIcons/icon_phone@2x.png" alt="">
              {{$t('common.download_app')}}</a>
          </button>
          <div v-if="user.token===''">
            <button class="signUp-btn" @click="$router.push('/signIn')">{{$t('common.signup_label')}}</button>
            <button class="red-btn signIn-btn" type="submit"
                    @click="$router.push('/signIn')">{{$t('common.login_label')}}
            </button>
          </div>
          <div v-if="user.token!==''">
              <b-dropdown no-caret offset="-90" variant="null">
                <template #button-content>
                  <div class="user-container">
                    <img src="../../assets/NavIcons/icon_user@2x.png" alt="" class="icon">{{user.name}}
                  </div>
                </template>
<!--                <b-dropdown-item href="#">-->
<!--                  <router-link to="/profile" style="color: black">-->
<!--                    <img src="../../assets/NavIcons/icon_user@2x.png" alt="" class="icon">-->
<!--                    {{$t('common.profile_label')}}-->
<!--                  </router-link>-->
<!--                </b-dropdown-item>-->
                <b-dropdown-item href="#">
                  <router-link to="/orderList" style="color: black">
                    <img src="../../assets/NavIcons/icon_orders@2x.png" alt="" class="icon">
                    {{$t('common.orders_label')}}
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item href="#">
                  <router-link to="/addrBook" style="color: black">
                    <img src="../../assets/HomeIcons/icon_address@2x.png" alt="" class="icon">
                    {{$t('common.my_address')}}</router-link>
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="goToCouponList">
                  <img src="../../assets/NavIcons/icon_coupon@2x.png" alt="" class="icon">
                  {{$t('common.my_coupon')}}
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="$emit('userLogoff')">
                  <img src="../../assets/NavIcons/icon_logoff@2x.png" alt="" class="icon">
                    {{$t('common.logout_label')}}
                </b-dropdown-item>
              </b-dropdown>
          </div>
        </div>
      </div>

      <div class="home-content">
        <div class="info-container">
          <div style="display: flex; flex-direction: row">
            <div id="title">Local favourites delivered to your doorstep</div>
            <div class="sm-img-container">
              <img src="../../assets/HomeIcons/home_jumbotron_icon.png" alt="">
            </div>
          </div>
          <div id="input_container">
            <img @click="$emit('popGetLocationModal')"
                 src="../../assets/HomeIcons/icon_address@2x.png" id="input_img">
            <!-- 地址补全input组件-->
            <AddressCompleteInput
                :locatorAddress="locatorAddress"
                id="address_input"
                :placeHolder="$t('common.enter_address')"
                v-on:updateAddress="setCurrentAddress($event)"
            />
            <button class="red-btn input-btn" @click="checkSelectedAddress(selectedAddress)">Go</button>
          </div>

          <div>
            <a href="https://play.google.com/store/apps/details?id=com.foodhwy.foodhwy" target="_blank">
              <img src="../../assets/HomeIcons/icon_google_download@2x.png" class="app-btn" alt="">
            </a>
            <a href="https://apps.apple.com/ca/app/foodhwy-%E9%A3%9F%E9%80%9F%E5%A4%96%E5%8D%96/id1063806270" target="_blank">
              <img src="../../assets/HomeIcons/icon_ios_download@2x.png" class="app-btn" alt="">
            </a>
            <div class="qr-btn">
              <img src="../../assets/HomeIcons/qr_code_icon@2x.png" alt="" style="width: 100%; margin-left: 5px; margin-right: 15px; margin-top: 20px;">
              <img class="qr-preview" src="../../assets/HomeIcons/qr_code.png">
            </div>
            <div class="qr-link-btn">
              <a href="https://fdfoods.page.link/vue" target="_blank">
                <img src="../../assets/HomeIcons/qr_code_icon@2x.png" alt="" style="width: 100%; margin-left: 5px; margin-right: 15px; margin-top: 20px;">
              </a>
            </div>
          </div>

        </div>

        <div class="img-container">
          <img src="../../assets/HomeIcons/home_jumbotron_icon.png" alt="">
        </div>

      </div>
    </b-jumbotron>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { AddressCompleteInfo } from "@/module/interface/AddressCompleteInfo";
  import AddressCompleteInput from "@/components/baseComponents/AddressCompleteInput.vue";
  import {User} from "@/module/interface/User";
  import {getLocalStorage} from "@/common/settingTools";
  import { LOCALES, Locales } from '@/i18n/locales'
  import {ApiHelper} from "@/api/ApiHelper";

  library.add(faUserSecret)
  Vue.component('font-awesome-icon', FontAwesomeIcon)

  @Component({
    components: {
      AddressCompleteInput
    }
  })
  export default class HomeJumbotron extends Vue {

    @Prop() private autoCompleteAddress!:AddressCompleteInfo[]
    @Prop() private locatorAddress!:string
    @Prop() private user!:User;

    private LOCALES = LOCALES
    private currentLocale = LOCALES.find(o => o.value === getLocalStorage().defaultLocale);
    private navScroll = 0
    private selectedAddress = this.locatorAddress ? this.locatorAddress : ""

    @Watch('user', {deep:true})watchCart(newValue: User){
       this.user = newValue
    }

    mounted() {
      window.onscroll = () => {
        this.navScroll = document.documentElement.scrollTop;
      };
    }

    goToCouponList() {
      this.$router.push(
        {
          name: 'CouponListView',
          query: {
            enableSelect: "0",
          },
        })
    }

    private changeLocale(lang:Locales): void{
      this.$store.dispatch("SET_LANGUAGE",lang)
      this.currentLocale = LOCALES.find(o => o.value === lang);
      ApiHelper.getInstance().updateAxiosHeaderLang(lang)
    }

    //设置选择的地址
    setCurrentAddress(address:string){
      this.selectedAddress = address
    }

    //点击go按钮的操作
    checkSelectedAddress(address:string){
      this.$emit('checkCurrentAddress',address)
    }

  }
</script>

<style scoped>

  @media screen and (max-width: 375px){

    .qr-link-btn{
      display: inline-block;
    }
    .qr-btn {
      display: none;
    }
    .app-btn {
      width: 25%;
    }
    .home-content{
      margin-top: 5vh;
    }
    .sm-img-container {
      max-width: 30vw;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
    }
    .sm-img-container img {
      width: 100%;
    }
    .jumbotron {
      height: 370px;
    }
    #title {
      align-self: center;
      font-size: 17px;
    }
    .signUp-btn, .red-btn{
      font-size: 14px;
    }
    .signUp-btn {
      display: none;
    }
    #download_btn {
      display: none;
    }
    .img-container {
      display: none;
    }
    .info-container {
      margin-left: 10px;
    }
    #input_container {
      width: 88vw;
      font-size: 14px;
    }
    #input_img {
      bottom:12px;
      left:12px;
      width: 15px;
      height: 18px;
    }
    .input-btn {
      bottom:5px;
      right:5px;
      width:45px;
    }
    .signIn-btn {
      margin-top: 10px;
      width: 75px;
    }
    .input-btn, .red-btn {
      height:30px;
      border-radius: 15px;
    }
    /deep/ .input-box {
      border-radius: 20px;
      height: 40px;
      padding-left: 35px;
      padding-right: 60px;
    }
  }

  @media screen and (min-width: 376px) and (max-width: 575px){

    .qr-link-btn{
      display: inline-block;
    }
    .qr-btn {
      display: none;
    }
    .app-btn {
      width: 28%;
    }
    .home-content{
      margin-top: 5vh;
    }
    .sm-img-container {
      max-width: 30vw;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
    }
    .sm-img-container img {
      width: 100%;
    }
    .jumbotron {
      height: 420px;
    }
    #title {
      align-self: center;
      font-size: 20px;
    }
    .signUp-btn, .red-btn{
      font-size: 14px;
    }
    .signUp-btn {
      display: none;
    }
    #download_btn {
      display: none;
    }
    .img-container {
      display: none;
    }
    .info-container {
      margin-left: 10px;
    }
    #input_container {
      width: 88vw;
      font-size: 14px;
    }
    #input_img {
      bottom:12px;
      left:12px;
      width: 15px;
      height: 18px;
    }
    .input-btn {
      bottom:5px;
      right:5px;
      width:45px;
    }
    .signIn-btn {
      margin-top: 10px;
      width: 75px;
    }
    .input-btn, .red-btn {
      height:30px;
      border-radius: 15px;
    }
    /deep/ .input-box {
      border-radius: 20px;
      height: 40px;
      padding-left: 35px;
      padding-right: 60px;
    }
  }

  @media screen and (min-width: 576px) and (max-width: 991px){

    .qr-link-btn{
      display: none;
    }
    .qr-btn {
      display: inline-block;
    }
    .app-btn {
      width: 25%;
    }
    .home-content{
      margin-top: 10vh;
    }
    .sm-img-container {
      display: none;
    }
    .img-container img{
      width: 80%;
    }
    .signUp-btn, .red-btn{
      font-size: 14px;
    }
    .signUp-btn{
      width: 65px;
      margin-bottom: 10px;
    }
    .jumbotron {
      height: 380px;
    }
    #download_btn {
      display: none;
    }
    #title {
      align-self: center;
      font-size: 18px;
    }
    #input_container {
      width: 320px;
      font-size: 14px;
    }
    #input_img {
      bottom:10px;
      left:15px;
      width: 20px;
      height: 24px;
    }
    .input-btn {
      bottom:6px;
      right:8px;
    }
    .input-btn, .red-btn {
      text-align: center;
      width:65px;
      height:36px;
      border-radius: 18px;
    }
    /deep/ .input-box {
      border-radius: 23px;
      height: 46px;
      padding-left: 45px;
      padding-right: 80px;
    }

  }

  @media screen and (min-width: 992px) {

    .qr-link-btn{
      display: none;
    }
    .qr-btn {
      display: inline-block;
    }
    .app-btn {
      width: 25%;
    }
    .home-content{
      margin-top: 10vh;
    }
    .sm-img-container {
      display: none;
    }
    #title {
      font-size: 46px;
    }
    .img-container img{
      width: 85%;
    }
    .info-container {
      flex: 50%;
    }
    #input_container {
      width: 445px;
    }
    .jumbotron {
      height: 520px;
    }
    #download_btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #input_img {
      bottom:10px;
      left:20px;
      width: 24px;
      height: 28px;
    }
    .input-btn {
      bottom:6px;
      right:8px;
    }
    .input-btn, .red-btn {
      width:85px;
      height:40px;
      border-radius: 20px;
    }
    /deep/ .input-box {
      border-radius: 30px;
      height: 50px;
      padding-left: 55px;
      padding-right: 100px;
    }
  }

  .home-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  #download_btn, .user-container, .lang-change {
    border: 1px solid var(--light-gray);
    background: white;
    border-radius: 5px;
    height: 36px;
    font-family: var(--light-font);
    font-size: 14px;
    padding: 0px 10px;
  }

  #download_btn {
    margin-top: 7px;
  }

  .user-container, .lang-change {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .home-content {
    display: flex;
    flex-direction: row;
  }

  .jumbotron {
    padding-top: 30px;
    background-image: url("../../assets/HomeIcons/home_jumbotron_bg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family:var(--regular-font);
  }

  .signUp-btn {
    margin-left: 25px;
    margin-right: 25px;
    border: none;
    background: none;
    margin-top: 10px;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  #input_container {
    position:relative;
    margin-top: 30px;
  }

  /deep/ .input-box {
    border: none;
    width: 100%;
  }

  #input_img {
    position:absolute;
    cursor: pointer;
    z-index: 1;
  }
  .input-btn {
    position:absolute;
  }

  .input-btn, .red-btn {
    border: none;
    background-color: var(--theme-red);
    color: white;
  }

  .b-dropdown:focus,input:focus,button:focus{
    outline: none;
  }

  .icon {
    width: 18px;
    /*height: 18px;*/
    margin-right: 5px;
  }

  .app-btn {
    max-height: 50px;
    margin-left: 5px;
    margin-right: 15px;
    margin-top: 20px;
  }

  .qr-btn, .qr-link-btn {
    width: 7%;
  }

  .qr-preview {
    display: none;
  }

  .qr-btn:hover .qr-preview {
    display: block;
    position: absolute;
    z-index: 1;
  }

</style>
