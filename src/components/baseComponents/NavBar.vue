<template>
  <!-- Navigation -->
  <div class="header">
      <b-navbar toggleable="sm" type="light" id="myNavbar">

        <b-navbar-brand href="#">
          <router-link to="/">
            <img src="../../assets/icon_facedrive_foods_main@2x.png" style="height: 30px; width: 125px" alt="">
          </router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" class="ml-auto">
          <template #default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item-dropdown no-caret left v-if="isShowCityList()">
              <template #button-content>
                <div class="user-container">
                  <img src="../../assets/HomeIcons/icon_address@2x.png" alt="" class="icon">
                  {{currentAddress ? currentAddress.substring(0,20) : $t('common.address_label')}}
                  <img src="../../assets/HomeIcons/icon_arrow_down@2x.png" alt="" style="width: 10px;margin-left: 5px">

                </div>
              </template>

              <div class="address-select-container">
                <div style="width: 340px; margin-top: 10px">
                  <h4 style="margin-left: 25px">{{$t('shop.choose_address')}}</h4>
                  <div class="address-input-container">
                    <!-- 地址补全input组件-->
                    <AddressCompleteInput
                      @click.native.stop=''
                      id="address_input"
                      :placeHolder="currentAddress ? currentAddress.substring(0,20) + '...' : $t('common.enter_address')"
                      v-on:updateAddress="setCurrentAddress($event)"
                    />
                    <button class="red-btn confirm-btn"
                            @click="checkAddress(selectedAddress)">
                      {{$t('common.confirm')}}</button>
                  </div>

                  <b-dropdown-item v-for="(o, i) in addressCategories"
                                   :key="i"
                                   :value="o.name"
                                   v-on:click="changeAddress(i)">{{ o.name.substring(0,25) + '...' }}</b-dropdown-item>
                </div>

                <div style="display: flex;flex-direction: column; margin-top: 10px; margin-right: 10px">
                  <h4 style="margin-left: 23px">{{$t('shop.choose_city')}}</h4>
                  <b-dropdown-item v-for="(o, i) in cityCategories"
                                   :key="i"
                                   :value="o.name"
                                   v-on:click="changeCity(i)">{{ o.name}}</b-dropdown-item>
                </div>

              </div>
            </b-nav-item-dropdown>

            <button class="restaurant-btn" style="margin-left: 20px" @click="goToRestaurants" v-if="isShowRestaurantBtn()">
              <img style="margin: 0px 5px 0px 0px" class="icon" src="../../assets/NavIcons/icon_restaurants@2x.png" alt="">
              <span class="r-text" >{{$t('shop.restaurant_btn')}}</span>
            </button>

          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">

<!--            <b-nav-item-dropdown :text="currentLocale.caption" right style="margin-top: 5px" class="lang-change">-->
<!--              <b-dropdown-item v-for="(o, i) in LOCALES"-->
<!--                               :key="i"-->
<!--                               :value="o.value"-->
<!--                               v-on:click="changeLocale(o.value)">{{ o.caption }}</b-dropdown-item>-->
<!--            </b-nav-item-dropdown>-->

            <button class="download-btn" style="margin-top: 8px">
              <a href="https://www.facedrive-foods.com/download" target="_blank" style="text-decoration: none; color: var(--dark-gray)">
                <img style="margin: 0px 5px 0px 0px" src="../../assets/SignInIcons/icon_phone.png" alt="" class="icon">
                {{$t('common.download_app')}}</a>
            </button>

            <b-nav-item-dropdown no-caret right v-if="user.token!==''">
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <div class="user-container">
                  <img src="../../assets/NavIcons/icon_user@2x.png" class="icon" alt="">{{user.name}}
                </div>
              </template>
<!--              <b-dropdown-item href="#">-->
<!--                <router-link to="/profile">-->
<!--                  <img src="../../assets/NavIcons/icon_user@2x.png" alt="" class="icon">-->
<!--                  {{$t('common.profile_label')}}</router-link>-->
<!--              </b-dropdown-item>-->
              <b-dropdown-item href="#">
                <router-link to="/orderList">
                  <img src="../../assets/NavIcons/icon_orders@2x.png" alt="" class="icon">
                  {{$t('common.orders_label')}}</router-link>
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="onAddrClick">
                <router-link to="/addrBook">
                  <img src="../../assets/HomeIcons/icon_address@2x.png" alt="" class="icon">
                  {{$t('common.my_address')}}</router-link>
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="goToCouponList">
                <img src="../../assets/NavIcons/icon_coupon@2x.png" alt="" class="icon">
                {{$t('common.my_coupon')}}
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="$emit('logoff')">
                <img src="../../assets/NavIcons/icon_logoff@2x.png" alt="" class="icon">
                {{$t('common.logout_label')}}
              </b-dropdown-item>


            </b-nav-item-dropdown>

            <div style="display: flex; flex-direction: row">
              <button v-if="user.token===''" class="signUp-btn"
                      @click="$router.push('/signIn')">{{$t('common.signup_label')}}</button>
              <button v-if="user.token===''" class="red-btn" type="submit"
                      @click="$router.push('/signIn')">{{$t('common.login_label')}}</button>
            </div>

          </b-navbar-nav>
        </b-collapse>

        <CartBar style="margin: 10px"/>

      </b-navbar>
  </div>

</template>


<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { Locales, LOCALES } from "@/i18n/locales";
  import { User } from "@/module/interface/User";
  import CartBar from "@/components/baseComponents/CartBar.vue";
  import InnerCartBar from "@/components/cart/InnerCartBar.vue";
  import {CityCategory} from "@/module/interface/City";
  import AddressCompleteInput from "@/components/baseComponents/AddressCompleteInput.vue";
  import {AddressComplete} from "@/logic/addressCompleteLogic/AddressComplete";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  import {getLocalStorage} from "@/common/settingTools";
  import {AddrBookLogic} from "@/logic/addrBookLogic/AddrBookLogic";

  library.add(faUserSecret)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  Vue.use(BootstrapVue)
  Vue.use(IconsPlugin)

  @Component({
    components:{
      AddressCompleteInput,
      InnerCartBar,
      CartBar,
    }
  })
  export default class NavBar extends Vue {

    @Prop() private cityCategories!: Array<CityCategory>
    @Prop() private addressCategories!: Array<CityCategory>
    @Prop() private user!: User;
    @Prop() private currentAddress!: string;
    @Prop() private currentCityId!: number;

    // private LOCALES = LOCALES
    // private currentLocale = LOCALES.find(o => o.value === getLocalStorage().defaultLocale);
    private globalSettings = GlobalSettingPreference.getInstance()
    private addressInfo = AddressComplete.getInstance()
    private selectedAddress:string = ""

    // private changeLocale(lang:Locales): void{
    //   this.$store.dispatch("SET_LANGUAGE",lang)
    //   this.currentLocale = LOCALES.find(o => o.value === lang);
    // }

    private changeAddress(i:number): void{
      this.setAddressInfo(this.addressCategories[i].name,this.addressCategories[i].id,this.addressCategories[i].lat,this.addressCategories[i].lng)
    }

    private changeCity(i:number): void{
      this.setAddressInfo(this.cityCategories[i].name,this.cityCategories[i].id,this.cityCategories[i].lat,this.cityCategories[i].lng)
    }

    private setAddressInfo(name:string,id:number,lat:number,lng:number){
      this.globalSettings.setUserAddressInfo(name,id)
      this.globalSettings.setUserAddressSession(name,id)
      this.globalSettings.setUserLatLng(lat,lng)
      this.globalSettings.setUserLatLngSession(lat,lng)
      this.$emit('setUserAddress', {name:name,id:id,lat:lat,lng:lng})
    }

    //设置选择的地址
    setCurrentAddress(address:string){
      this.selectedAddress = address
    }

    checkAddress(address:string){
      this.addressInfo.checkAddressValid(address).then((result) => {
        if(result.city_id > 0){
          //地址匹配成功后写入全局User和缓存
          this.globalSettings.setUserAddressInfo(address,result.city_id)
          this.globalSettings.setUserAddressSession(address,result.city_id)
          //地址匹配成功后写入地址返回的经纬度
          let latlng = result.customer_latlng.split(",")
          // console.log(latlng)
          this.globalSettings.setUserLatLng(latlng[0],latlng[1])
          this.globalSettings.setUserLatLngSession(latlng[0],latlng[1])
          this.$emit('setUserAddress',
            {name:address,id:result.city_id,lat:latlng[0],lng:latlng[1]}
          )
        }else{
          alert("invalid address!!! please enter a valid address")
        }
      }).catch(e => {console.log(e)})
    }

    onAddrClick(){
      AddrBookLogic.getInstance().setEnableSelect(0)
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

    goToRestaurants(){
      if(this.$route.name !== 'RestaurantListView'){
        this.$router.push(
          {
            name: "RestaurantListView",
            query:{
              cityId:this.globalSettings.getAddressInfo().cityId.toString()
            }
          })
      }else {
        return null
      }
    }

    private isShowRestaurantBtn(): boolean {
      return this.$route.name !== 'RestaurantListView';
    }

    private isShowCityList(): boolean {
      return this.$route.name === 'RestaurantListView';
    }

  }
</script>

<style scoped>

  @media screen and (max-width: 1170px){
    .user-container,.signUp-btn,.red-btn{
      font-size: 14px;
    }
    .download-btn {
      display: none;
    }
    .address-select-container{
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow-y: auto;
    }
  }

  @media screen and (min-width: 1171px){
    .download-btn,.user-container,.signUp-btn,.red-btn, .restaurant-btn{
      font-size: 16px;
    }
    .address-select-container{
      display: flex;
      flex-direction: row;
      max-height: 600px;
      overflow-y: auto;
    }
  }

  #myNavbar {
    font-family: var(--regular-font);
    min-height: 80px;
    background: white;
    border-bottom: 1px solid lightgray;
  }

  .b-dropdown:focus,input:focus,button:focus{
    outline: none;
  }

  .header {
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 2;
    /*display: flex;*/
  }

  a{
    text-decoration: none;
    color: #2c3e50;
  }

  a:hover{
    color: #42b983;
  }

  #nav-collapse {
    text-align: left;
  }

  .lang-change {
    margin-left: 10px;
  }

  .cart{
    align-self: center;
  }

  .btn {
    border-radius: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .container{
    margin-top: 40px;
    position: absolute;
    width: 375px;
    height:  max-content;
    z-index: 1;
    right: 0px;
  }

  .user-container, .restaurant-btn {
    display: flex;
  }

  .user-container, .download-btn, .restaurant-btn {
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    border: 1px solid lightgrey;
    background: white;
    border-radius: 5px;
    height: 36px;
    font-family: var(--light-font);
    margin-left: 10px;
    margin-right: 10px;
    color: var(--dark-gray);
  }

  .red-btn {
    border: none;
    border-radius: 20px;
    background-color: var(--theme-red);
    color: white;
    width:95px;
    height:40px;
    margin-top: 5px;
  }

  .signUp-btn {
    margin-top: 5px;
    width: 95px;
    border: none;
    background: none;
  }

  .icon {
    width: 18px;
    /*height: 20px;*/
    margin-right: 5px;
  }

  /deep/ .input-box {
    border: none;
    width: 70%;
    margin-top: 6px;
    margin-bottom: 10px;
    margin-left: 10px;
    padding-left: 10px;
  }

  .address-input-container {
    position: relative;
    border: 1px solid var(--light-gray);
    border-radius: 20px;
    height: 40px;
    width: 80%;
    margin: 10px 20px 10px 20px;
  }

  .confirm-btn {
    position: absolute;
    width: 60px;
    height: 30px;
    top: -1px;
    font-size: 12px;
    right: 5px;
    display: flex;
    align-items: center;
    justify-content: center
  }


</style>
