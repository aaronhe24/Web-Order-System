<template>
  <div id="app">
    <NavBar v-if="currentRouteName!=='SignInView' && currentRouteName!=='HomeView'"
            :cityCategories="cityCategories"
            :addressCategories="addressCategories"
            :user="user"
            :currentAddress="currentAddress"
            :currentCityId="currentCityId"
            v-on:setUserAddress="updateUserAddress"
            v-on:logoff="logout">
    </NavBar>

    <router-view
      :cityInfo="cityInfo"
      :currentAddress="currentAddress"
      :currentCityId="currentCityId"
      v-on:logged="updateUserProfile($event)"
      v-on:setUserAddress="updateUserAddress"
    />

    <Footer v-if="currentRouteName!=='ShopOrderView' && currentRouteName!=='PaymentView'"></Footer>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import Footer from "@/components/baseComponents/Footer.vue";
  import NavBar from "@/components/baseComponents/NavBar.vue";
  import {UserProfile} from "@/logic/userProfileLogic/UserProfile";
  import {User} from "@/module/interface/User";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  import {HomeLogic} from "@/logic/homeLogic/HomeLogic";
  import {City, CityCategory} from "@/module/interface/City";
  import {OrgH5GeoLogic} from "@/logic/goeLogic/OrgH5GeoLogic";
  declare let gtag:Function;
  declare let fbq:Function;

  @Component({
    components:{
      NavBar,
      Footer,
    }
  })

  export default class App extends Vue {

    private homeInfo = HomeLogic.getInstance()
    private userProfile = UserProfile.getInstance()
    private globalSettings = GlobalSettingPreference.getInstance()
    private user: User = this.globalSettings.getUser()
    private currentAddress: string = this.globalSettings.getAddressInfo().address
    private currentCityId: number = this.globalSettings.getAddressInfo().cityId
    private cityInfo: Array<City> = []
    private cityCategories: Array<CityCategory> = []
    private addressCategories  = this.globalSettings.getAddressCategory()

    mounted(){

      this.track('/')

      // alert(screen.width)
      this.homeInfo.fetchAreaList()
        .then(() => {
          this.cityInfo = this.homeInfo.getCityInfoList()
          this.cityCategories = this.homeInfo.getCityCategoryList()
          // console.log(this.cityInfo)
          // console.log(this.cityCategories)
        }).catch(e => {console.log(e)})

      //当路由改变，调取gtag和fbq
      this.$router.afterEach((to, from) => {
        this.track(to.path)
      });
    }

    //gtag和fb页面track
    track(path:string){
      // console.log(path)
      // gtag('config','AW-919930352',{'page_path' : to.path});
      this.$gtag.pageview({page_path: path})
      fbq('track', 'PageView');
    }

    //获取当前路由名称
    get currentRouteName () {
      return this.$route.name
    }

    //登入后刷新导航栏登录状态
    updateUserProfile (profile: User) {
      this.user = profile
    }

    //输入地址后更新导航栏地址信息
    updateUserAddress (args:any) {

      const name = args.name
      const id = args.id
      const lat = args.lat
      const lng = args.lng

      this.currentAddress = name
      this.currentCityId = id
      //更新url的query参数
      if(this.$route.query.cityId !== id.toString() && this.$route.name == 'RestaurantListView'){
        this.$router.replace({query: {cityId: id}})
      }
      //更新默认的地址选项
      if( !this.addressCategories.some(item => item.name === name) && !this.cityCategories.some(item => item.name === name) ){
        this.addressCategories.push({id:id,name:name,lat:Number(lat),lng:Number(lng)})
        this.globalSettings.setUserAddressListSession(this.addressCategories)
      }
    }

    //从导航栏全局logout
    logout() {
      this.userProfile.logout().then( () => {
        //清空全局User,清空User缓存
        this.globalSettings.clearUser()
        this.globalSettings.clearUserSession()
        this.user = new User()
        this.currentAddress = ''
      }).catch( e => console.log(e))
    }

  }

</script>

<style>

  @import './common/globalStyle.css';

  body{
    height: 100%;
    margin: auto;
    color: var(--dark-gray);
    background: #ffffff;
    transition: transform ease-in .4s;
    /*overflow: hidden;*/
  }

  #app {
    font-family:var(--regular-font);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

</style>
