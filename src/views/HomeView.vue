<template>
  <div class="home">
    <HomeJumbotron
      v-on:popGetLocationModal="popGetLocationModal"
      v-on:checkCurrentAddress="checkUserAddress($event)"
      v-on:userLogoff="userLogoff"
      :locatorAddress="locatorAddress"
      :user="user"
    />
    <div>
      <b-jumbotron fluid>
        <h1>{{$t('common.select_city')}}</h1>
        <div class="items-container">
          <CityCardCell v-for="(city,index) in cityInfo"
                        :cityName="city.name"
                        :cityImg="city.thumb"
                        :cityId="city.id"
                        :key="index"
                        v-on:setCityInfo="sendUpdateAddress"
          />
        </div>
      </b-jumbotron>

      <AlertModal id="address-permission"
                  :okOnly="false"
                  :title="$t('common.alert')"
                  :content="$t('common.address_permission')"
                  v-on:onPressOK="getUserLocation"/>

    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from 'vue-property-decorator'
  import HomeJumbotron from "@/components/baseComponents/HomeJumbotron.vue";
  import CityCardCell from "@/components/home/CityCardCell.vue";
  import {City} from "@/module/interface/City";
  import {OrgH5GeoLogic} from "@/logic/goeLogic/OrgH5GeoLogic";
  import { GlobalSettingPreference } from "@/GlobalSettingPreference";
  import { AddressComplete } from "@/logic/addressCompleteLogic/AddressComplete";
  import AlertModal from "@/components/baseComponents/AlertModal.vue";
  import {User} from "@/module/interface/User";
  import {UserProfile} from "@/logic/userProfileLogic/UserProfile";

  @Component({
    components: {
      HomeJumbotron,
      CityCardCell,
      AlertModal
    }
  })

export default class HomeView extends Vue {

  @Prop() private cityInfo!: Array<City>

  private geoInfo = OrgH5GeoLogic.getInstance()
  private userLatLng:any
  private globalSettings = GlobalSettingPreference.getInstance()
  private addressInfo = AddressComplete.getInstance()
  private locatorAddress:string = ""
    private userProfile = UserProfile.getInstance()
    private user = this.globalSettings.getUser();
    mounted() {
      //将页面重置到顶部
      window.scrollTo(0,0);
  }

  //用户输入地址后点击GO按钮，需要校验地址是否在圈内
  checkUserAddress(input:string){
    if(input){
      this.addressInfo.checkAddressValid(input).then((result) => {
        if(Number(result.city_id) > 0){
          //地址匹配成功后写入全局User和缓存
          this.globalSettings.setUserAddressInfo(input,result.city_id)
          this.globalSettings.setUserAddressSession(input,result.city_id)
          //地址匹配成功后写入地址返回的经纬度
          let latlng = result.customer_latlng.split(",")
          this.globalSettings.setUserLatLng(latlng[0],latlng[1])
          this.globalSettings.setUserLatLngSession(latlng[0],latlng[1])
          this.$emit('setUserAddress',
            {name:input,id:result.city_id,lat:latlng[0],lng:latlng[1]}
          )
          this.goToUserLocationRestaurants(input,result.city_id)
        }else{
          alert("Invalid address! please enter a valid address")
        }
      }).catch(e => {console.log(e)})
    }else{
      alert("Invalid address! please enter a valid address")
    }
  }

  //去往用户所在地址城市的餐厅列表
  goToUserLocationRestaurants(name:string,city_id:number){
    this.$router.push(
      {
        name: "RestaurantListView",
        params: {
          id: city_id.toString(),
          name: name,
        },
        query:{
          cityId:city_id.toString()
        }
      })
  }

  sendUpdateAddress(args:any){
    const name = args.name
    const id = args.id
    //地址匹配成功后写入全局User和缓存
    this.globalSettings.setUserAddressInfo(name,id)
    this.globalSettings.setUserAddressSession(name,id)
    this.globalSettings.setUserLatLng(0,0)
    this.globalSettings.setUserLatLngSession(0,0)
    this.$emit('setUserAddress',
      {name:name,id:id,lat:0,lng:0}
    )
  }

  popGetLocationModal() {
    this.$root.$emit('bv::show::modal', 'address-permission')
  }

  //定位当前用户位置
  getUserLocation(){
    this.geoInfo.getLocation()
    this.userLatLng = this.globalSettings.getUserLatLng()
    this.addressInfo.locateUserAddress(this.userLatLng).then(()=>{
      this.locatorAddress = this.addressInfo.getLocatorAddress()
    })
  }

  userLogoff() {
    //清空全局User,清空User缓存
    this.userProfile.logout().then( () => {

      //清空全局User,清空User缓存
      this.globalSettings.clearUser()
      this.globalSettings.clearUserSession()
      this.user = this.globalSettings.getUser();
    }).catch( e => console.log(e))
  }

}
</script>

<style scoped>

  @media screen and (max-width: 375px){
    .jumbotron h1 {
      font-size: 18px;
    }
  }

  @media screen and (min-width: 376px) and (max-width: 991px){
    .jumbotron h1 {
      font-size: 24px;
    }
  }

  @media screen and (min-width: 992px) {
  }

  .jumbotron {
    font-family: var(--regular-font);
    background-color: white;
  }

  .jumbotron h1 {
    text-align: left;
    margin-bottom: 25px;
    margin-left: 10px;
  }

  .items-container{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }

</style>
