<template>
  <div>
  <b-jumbotron fluid>
    <SearchBar
      id="search_container"
      :placeHolder="$t('common.search_shop')"
      v-on:submitSearch="submitSearch($event)"
      @change="onChange($event)"
      ref="add"
    />

    <div class="input-autocomplete" v-show="input_auto">
      <ul>
        <li v-for="(item,index) in shopIdlist" :key="index">
          <a @click="submitSearch(item.name)">{{item.name}}</a>
        </li>
      </ul>
    </div>

    <RestaurantCategorySlider
      :shopCategories="shopCategories"
      v-on:setShopFilter="setShopFilter($event)"
    />

    <h1 class="shop-title">{{$t('shop.list_title')}}</h1>

    <NoDataView style="margin-top: 50px"
                :content="$t('common.no_results')"
                v-if="shopList.length < 1"/>

    <div class="restaurant-container">
      <RestaurantCardCell v-for="(shop,index) in shopList"
          :key="index"
          :id="shop.mid"
          :img="shop.thumb"
          :name="shop.name"
          :min="shop.min_amount"
          :cookingTime="shop.cooking_minutes"
          :km="geoLogic.getDistanceBetween(globalSettings.getUserLatLng().lat,globalSettings.getUserLatLng().lng,shop.lat,shop.lon)"
          :openTime="shop.today_open_time"
          :tags="shop.tags"
      />
    </div>

    <MaskLoading :isShow="isShowLoading"/>
    <Loading :isShow="isShowLoadingMore"/>

  </b-jumbotron>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import { ShopListLogic } from "@/logic/shopListLogic/ShopListLogic";
  import { Shop } from "@/module/interface/Shop";
  import { GlobalSettingPreference } from "@/GlobalSettingPreference";
  import RestaurantCardCell from  "@/components/shop/RestaurantCardCell"
  import Loading from "@/components/baseComponents/Loading.vue";
  import { ShopCategoriesEn, ShopCategoriesCn } from "@/module/interface/ShopCategories";
  import RestaurantCategorySlider from "@/components/shop/RestaurantCategorySlider.vue";
  import SearchBar from "@/components/baseComponents/SearchBar.vue";
  import NoDataView from "@/components/baseComponents/NoDataView.vue";
  import {getLocalStorage} from "@/common/settingTools";
  import {Locales} from "@/i18n/locales";
  import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
  import {OrgH5GeoLogic} from "@/logic/goeLogic/OrgH5GeoLogic";

  @Component({
    components: {
      SearchBar,
      RestaurantCategorySlider,
      RestaurantCardCell,
      Loading,
      MaskLoading,
      NoDataView,
    }
  })

  export default class RestaurantListView extends Vue {

      @Prop() private currentAddress!: string
      @Prop() private currentCityId!: number

      private shopCategories = getLocalStorage().defaultLocale === Locales.EN ? ShopCategoriesEn : ShopCategoriesCn
      private globalSettings = GlobalSettingPreference.getInstance()
      private shopListLogic = ShopListLogic.getInstance()
      private shopList: Array<Shop> = []
      private cityName = this.$route.params.name ? this.$route.params.name : ""
      private cityId = Number(this.$route.query.cityId)
      private shop_ids = ''
      private offset:number = 0
      private limit:number = 30
      private shopType = 0
      private hasMore = true
      private isShowLoadingMore =  false
      private isShowLoading =  false
      private isShowSearch = false

      private geoLogic = OrgH5GeoLogic.getInstance()
      private date: Array<Shop> = []
      private shopId = Number(this.$route.query.shopId)
      shopIdlist: any;
      private input_auto!: boolean;
      private inputValue = ''
      private list = ''
      private inputs = ''

      data() {
        return{
          shopIdlist:[],
          input_auto:false
        }
      }

      mounted() {
          //将页面重置到顶部
          window.scrollTo(0,0);
          this.isShowLoading = true

          this.globalSettings.setUserAddressInfo(this.cityName,this.cityId)
          this.refreshShopLists(false)
          const userAddress = this.globalSettings.getAddressInfo().address;
          this.globalSettings.setUserAddressInfo(userAddress, this.cityId);

          //检测是否滚到了最底部
            window.onscroll = () => {
              let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
              if (bottomOfWindow && !this.isShowSearch && this.$route.name === 'RestaurantListView' && this.hasMore && this.cityId) {
                this.isShowLoadingMore = true
                this.fetchMoreShopList()
              }
            };
        }

      @Watch('currentAddress')checkStatus(newValue:string,oldValue:string){
        this.cityName = newValue
        this.cityId = this.currentCityId
        this.hasMore = true
        this.isShowLoading = true
        this.offset = 0
        this.refreshShopLists(false)
        this.globalSettings.setUserAddressInfo(this.cityName,this.cityId)
      }

      // @Watch('$route.query.cityId')checkCidStatus(newValue:number,oldValue:number){
      //     this.cityId = this.currentCityId
      //     this.hasMore = true
      //     this.isShowLoading = true
      //     this.offset = 0
      //     this.refreshShopLists(false)
      //     this.globalSettings.setUserAddressInfo(this.cityName,this.cityId)
      // }

      //刷新城市列表
      refreshShopLists(fetchMore:boolean){
        this.isShowSearch = false
        this.shopListLogic.fetchShopList
        (
          this.cityId,this.globalSettings.getUserLatLng().lat,this.globalSettings.getUserLatLng().lng,
          this.shopType,"recommand",this.offset,this.limit,fetchMore
        ).then(() => {
            this.shopList = this.shopListLogic.getShopList()
            this.shopListLogic.searchCityId(this.cityId)
            this.isShowLoadingMore = false
            this.isShowLoading = false
            console.log(this.shopList)
            if(this.shopListLogic.getCurrentList().length === 0){
              this.hasMore = false
            }
          }).catch(e => console.log(e))
      }

      //加载更多商户列表
      fetchMoreShopList(){
        this.offset = this.limit + this.offset
        this.refreshShopLists(true)
      }

      setShopFilter(item:any){
        this.shopType = item.id
        this.offset = 0
        this.isShowLoadingMore = true
        this.refreshShopLists(false)
        // console.log(item)
      }

      submitSearch(input:string){
        this.isShowSearch = true
        this.isShowLoadingMore = true
        this.input_auto = true
        this.shopListLogic.searchShop(this.cityId,input,this.shop_ids).then(() => {
          this.shopList = this.shopListLogic.getShopList()
          this.shop_ids=this.list
          this.isShowLoadingMore = false
          this.input_auto = false
          let inputValue = (this.$refs.add as SearchBar).init(input)
        })
        console.log(this.inputValue)
      }

      onChange(input:string){
        //请求
        this.shopListLogic.searchCityId(this.cityId)
        // 从localstorege中获取数据
        let date = localStorage.getItem(this.cityId+"_city_shop_lists") || ''
        let dataed = JSON.parse(date)
        this.shopIdlist=[]
        this.list=''
        console.log(dataed)
        if(input.length>=2){
          this.isShowSearch = true
          this.isShowLoadingMore = true
          this.input_auto = true
          console.log(input)
          let inputValue = (this.$refs.add as SearchBar).submitInput(input)
         //循环匹配
         //TODO
          for(let i = 0; i < dataed.length; i++) {
            if (dataed[i].full_name.toLowerCase().includes(input.toLowerCase()) || dataed[i].pinyin.toLowerCase().includes(input.toLowerCase())) {
              this.shopIdlist.push({name:dataed[i].name,shop_id:dataed[i].shop_id,full_name:dataed[i].full_name,pinyin:dataed[i].pinyin})
              this.list=this.list+','+dataed[i].shop_id
            }
          }
          console.log(this.list)
          console.log(this.shopIdlist)
          this.shop_ids=this.list
          this.isShowLoadingMore = false
        }else{
          this.input_auto = false
        }
      }
    }
</script>

<style scoped>

  @media screen and (max-width: 991px) {
    .shop-title {
      font-size: 32px;
      margin-left: 5px;
    }
  }

  #search_container {
    width: 95%;
    display: flex;
    position:relative;
    margin-top: 30px;
    margin-left: 10px;
  }

  .input-autocomplete{
    position:relative;
    margin-top: 0px;
    margin-left: 10px;
    min-height: 200px;
    z-index: 1;
    width: 1050px;
    position:absolute;
    border-radius: 20px;
    border:1px solid lightgray;
    background: #fcfcfc;
  }

  ul{
    box-sizing: border-box;
    padding: 10px;
  }

  ul li{
    list-style: none;
    line-height: 35px;
    text-align: left;
    border-radius: 5px;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  ul li:hover{
    background-color: rgba(153, 149, 149, 0.5);
  }

  ul li a{
    text-decoration: none;
    margin-left: 5px;
  }

  .shop-title {
    margin-top: 45px;
    text-align: left;
  }

  .jumbotron {
    background-color: white;
    font-family: var(--regular-font);
  }

  .restaurant-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0px;
    margin-top: 50px;
  }

</style>
