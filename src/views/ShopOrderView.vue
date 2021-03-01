<template>
  <div style="position: relative">
    <div class="shop">

      <ShopDetailCardCell class="shop-detail-card"
                          :shopDetail="shopDetail"
                          :deliveryType="currentShippingType"
                          :pickupStatus="pickupStatus"
                          v-on:onChangeDelivery="onChangeDelivery($event)"
      />

      <div id="category-container" class="category-container">
        <div v-show="showRightBtn" class="right-btn nav-btn" @click="slideRight">
          >
        </div>
        <div v-show="showLeftBtn" class="left-btn nav-btn" @click="slideLeft">
          <
        </div>
        <ul class="category-list" ref="container">
          <li v-for="(category,index) in menuContents"
              style="display: inline-block"
              ref="cats"
          >
            <a v-smooth-scroll
               :href="`#${index}`"
               class="menu-selector"
               :style="{'margin-right': index === menuContents.length - 1 ? '60px' : null}"
               :class="index === activeCategory ? 'is-active': null">
              {{category.category}}
            </a>
          </li>
        </ul>
      </div>

      <div id="menu-container" class="menu-container">
        <div v-for="(item,index) in menuContents" style="margin-bottom: 45px"
             :id="index" class="menu-item" ref="items">
          <h2 class="category-name">{{item.category}}</h2>
          <div class="items-container">
            <ShopProductCardCell
              v-for="(product,index) in item.products"
              v-on:onClickDetail="onClickProductDetail"
              :product="product"
              :key="index"
            />
          </div>
        </div>
      </div>

    </div>


    <div class="cart-bar">
      <InnerCartBar
        class="cart-content"
      />
    </div>

    <ProductDetailView id="productDetail"
                       :product="selectedProductCopy"
                       v-on:onClickOK="onClickModalOk($event)"
                       v-on:onClickCancel="onClickModalCancel"/>

    <MaskLoading :isShow="isShowLoading"/>

    <LightFooter class="footer"/>

    <AlertModal id="clean-cart"
                :okOnly="true"
                :title="$t('shop.clean_cart_title')"
                :content="$t('shop.clean_cart_text')"
                v-on:onPressOK="clearCart"/>

    <div class="to-top-container" v-if="isShowTopBtn">
      <img src="../assets/icon_top.png" alt="" style="width: 100%; cursor: pointer" @click="backToTop">
    </div>

  </div>
</template>

<script lang="ts">

  import {Component, Vue, Watch} from 'vue-property-decorator';
  import ShopProductCardCell from "@/components/shop/ShopProductCardCell.vue";
  import {Menu} from "@/module/interface/Menu";
  import {Product} from "@/module/Product";
  import ProductDetailView from "@/views/ProductDetailView.vue";
  import {ProductListLogic} from '@/logic/productListLogic/ProductListLogic';
  import {ShopDetailLogic} from "@/logic/shopDetailLogic/ShopDetailLogic";
  import InnerCartBar from "@/components/cart/InnerCartBar.vue";
  import {createDefaultShopDetail} from "@/module/interface/ShopDetail";
  import ShopDetailCardCell from "@/components/shop/ShopDetailCardCell.vue";
  import {ShippingType} from "@/module/interface/ShippingType";
  import LightFooter from "@/components/baseComponents/LightFooter.vue";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
  import {DeliveryType} from "@/module/enum/DeliveryType";
  import AlertModal from "@/components/baseComponents/AlertModal.vue";

  @Component({
    components: {
      ShopDetailCardCell,
      ProductDetailView,
      ShopProductCardCell,
      InnerCartBar,
      LightFooter,
      MaskLoading,
      AlertModal
    }
  })


  export default class ShopOrderView extends Vue {

    private productsList = ProductListLogic.getInstance();
    private shopDetailLogic = ShopDetailLogic.getInstance();
    private menuContents: Menu[] | undefined = [];
    private shopId: number = Number(this.$route.query.shopId);
    private selectedProductCopy: Product = new Product();
    private selectedProduct: Product = new Product();
    private shopDetail = createDefaultShopDetail();
    private activeCategory = 0
    private currentShippingType = ""
    private cart: SyncApiCart = SyncApiCart.getInstance();
    private showRightBtn = true
    private showLeftBtn = true
    private isShowLoading = false
    private pickupStatus = 9

    private isShowTopBtn = false

    @Watch('shopDetail') checkStatus(newValue: string, oldValue: string) {
      this.currentShippingType = this.initDeliveryType()
      //确认好shipping type后再拉取商品列表
      this.getShopProducts()
      this.productsList.setShippingType(this.currentShippingType)
    }

    mounted() {

      //将页面重置到顶部
      window.scrollTo(0, 0);
      this.isShowLoading = true

      //获取商户详情
      this.shopDetailLogic.fetchShopDetail(this.shopId).then(() => {
        this.shopDetail = this.shopDetailLogic.getShopDetail()
        this.productsList.setShopDetail(this.shopDetail)
        this.pickupStatus = this.shopDetail.customer_pickup
      })

      window.onscroll = () => {
        let isTop = this.checkScrollToTop();
        this.isShowTopBtn = !isTop;

        if(this.onCurrentView()){
          // 定位当前滚动位置匹配菜单block
          let blockEls = this.$refs.items as Element[]
          if(!blockEls){
            return
          }
          this.activeCategory = this.getCurrentProductView(blockEls);
          this.getCatContainer().scrollLeft += this.getHorizonScrollPositionToLeft()
        }

      }

    }


    private onCurrentView(): boolean {
      return this.$route.name === 'ShopOrderView';
    }

    getProductViewDistance(top: number){
      return Math.round(Math.abs(top) - 50);
    }

    getCurrentProductView(es: Element[]){
      let ranges = es.map(e=>{
        return {
          index: es.indexOf(e),
          range: this.getProductViewDistance(e.getBoundingClientRect().top),
          top: e.getBoundingClientRect().top,
          bottom: e.getBoundingClientRect().bottom
        }
      })

      ranges = ranges.filter(r=> r.bottom>50)
      ranges.sort((a, b)=>{
        return a.range - b.range
      });
      return ranges[0].index;
    }

    getHorizonScrollPositionToLeft(){
      let _items = this.getCategoryItem();
      let left = _items.getBoundingClientRect().left - this.getStartPoint();
      // let width = _items.getBoundingClientRect().width;
      let width = this.getCatContainer().getBoundingClientRect().width * 3/4;
      return left > width || left <= 0?  Math.round(left) : 0;
    }

    getStartPoint(){
      let c  = this.getCatContainer()
      return Math.round(c.getBoundingClientRect().left)
    }

    getCatContainer(){
      return this.$refs.container as HTMLInputElement
    }

    getCategoryItem(){
      let blockEls = this.$refs.cats as Element[]
      return  blockEls[this.activeCategory];
    }

    isShopChanged(): boolean {
      return this.cart.isShopChanged(this.shopId)
    }

    showAlert() {
      //购物车有东西才提示清空
      if (this.cart.getCartCounter() > 0) {
        this.$root.$emit('bv::show::modal', 'clean-cart');
      } else {
        return null
      }
    }

    clearCart() {
      // 需要判断是否切店再清空
      this.cart.clearCart();
      this.$root.$emit('bv::hide::modal', 'clean-cart');
    }

    initDeliveryType() {

      if (!this.isShopChanged() && this.cart.getCartCounter() > 0) {
        return SyncApiCart.getInstance().getDeliveryType()
      } else {
        return this.setDefaultShippingType()
      }
    }

    setDefaultShippingType() {
      if (this.pickupStatus === 0 || this.pickupStatus === 1) {
        return ShippingType.DELIVERY
      } else {
        return ShippingType.PICKUP
      }
    }

    // getCachedMenu() {
    //   this.menuContents = this.productsList.getCashedShopMenu();
    //   // this.menuId = this.productsList.getMenuIndexId()
    //   // console.log(this.menuId)
    //   // this.observeScrollTracking(this.menuId)
    // }

    async getShopProducts() {
      this.productsList.setShopId(this.shopId);
      this.menuContents = await this.productsList.initializeMenu(this.shopId, this.currentShippingType)
      this.isShowLoading = false
    }

    onClickProductDetail(p: Product): void {
      if (this.isShopChanged()) {
        this.showAlert()
      } else {
        this.selectedProduct = p
        this.selectedProductCopy = p.deepCopyProduct();
        this.selectedProductCopy.qty = 1;
        this.$bvModal.show('productDetail')
      }
    }

    onClickAddProduct(p: Product): void {
      this.productsList.add(p)
    }

    onClickReduceProduct(p: Product): void {
      this.productsList.reduce(p)
    }

    onClickModalOk(p: Product) {
      this.$bvModal.hide("productDetail")
      if (p.qty === 0) {
        return
      }
      this.setNote(p.note)
      this.onClickAddProduct(p);
    }

    setNote(note: string) {
      if (this.selectedProduct.hasOption()) {
        //带option的菜品不需要预设note
        return;
      }
      this.selectedProduct.note = note;
    }

    onClickModalCancel() {
      this.$bvModal.hide("productDetail")
    }

    //切换配送方式后，重新调取菜单接口
    onChangeDelivery(deliveryType: string) {
      this.isShowLoading = true
      this.currentShippingType = deliveryType
      this.getShopProducts()
      //切换配送服务时候重置购物车和配送方式
      this.productsList.setShippingType(deliveryType)
      this.productsList.initCart();
      // console.log("try" + SyncApiCart.getInstance().getDeliveryType())
    }

    slideRight() {
      let container = this.$refs.container as HTMLInputElement
      container.scrollLeft += 240
    }

    slideLeft() {
      let container = this.$refs.container as HTMLInputElement
      container.scrollLeft -= 240
    }

    private checkScrollToTop(): boolean {
      return document.documentElement.scrollTop == 0
    }

    backToTop() {
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }

  }

</script>

<style scoped>

  .to-top-container {
    position: fixed;
  }

  .to-top-container:hover {
    bottom: 4vh;
    transition: 0.2s;
  }

  .menu-item {
    padding-top: 180px;
    margin-top: -180px;
  }

  .menu-selector {
    color: var(--dark-gray);
    text-decoration: none;
    font-weight: bold;
  }

  .category-container {
    margin-top: 30px;
    position: sticky;
    top: 75px;
    background-color: white;
    border-top: 1px solid var(--light-gray);
    border-bottom: 1px solid var(--light-gray);
    z-index: 1;
  }

  .category-list {
    list-style: none;
    white-space: nowrap;
    display: flex;
    align-items: center;
    scroll-behavior: smooth;
  }

  .is-active {
    color: white;
    background: var(--theme-red);
    /*border: 1px solid lightgray;*/
    border-radius: 23px;
    font-weight: bold;
  }

  .shop {
    font-family: var(--regular-font);
  }

  .shop-detail-card {
    position: relative;
    /*height: 462px;*/
    margin-top: 100px;
    display: flex;
    flex-direction: column;
  }

  .category-name {
    text-align: left;
    margin-left: 10px;
  }

  .menu-container {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
  }

  .items-container {
    justify-content: flex-start;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-btn {
    position: absolute;
    z-index: 1;
    cursor: pointer;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid lightgray;
    box-shadow: 0px 0px 5px lightgray;
  }

  .right-btn {
    right: 0%;
  }

  .left-btn {
    left: 0%;
  }

  .nav-btn:hover {
    background: var(--theme-red);
    color: white;
  }

  .footer {
    margin-top: 150px;
    z-index: -1;
  }

  @media screen and (min-width: 1920px) {

    .to-top-container {
      width: 50px;
      height: 70px;
      bottom: 2vh;
      right: calc(350px + 2vw);
    }

    .category-container, .category-list {
      height: 80px;
      padding-right: 25px;
      padding-left: 25px;
    }

    .menu-selector {
      margin: 0px 15px;
      font-size: 16px;
      padding: 10px;
      font-weight: bold;
    }

    .footer {
      width: 85%;
    }

    .category-list {
      overflow-x: hidden;
    }

    .cart-bar {
      font-family: var(--regular-font);
      border-left: 1px solid var(--light-gray);
      position: fixed;
      top: 80px;
      right: 0px;
      height: 100%;
      width: 350px;
      background-color: white;
    }

    .cart-content {
      width: 100%;
    }

    .shop {
      margin-left: 20%;
      margin-right: calc(350px + 20%);
    }

    .nav-btn {
      top: 25%;
      border-radius: 20px;
      width: 40px;
      height: 40px;
    }
  }

  @media screen and (min-width: 991px) and (max-width: 1919px) {

    .to-top-container {
      width: 50px;
      height: 70px;
      bottom: 2vh;
      right: calc(350px + 2vw);
    }

    .category-container, .category-list {
      height: 60px;
      padding-right: 25px;
      padding-left: 25px;
    }

    .menu-selector {
      margin: 0px 10px;
      font-size: 16px;
      padding: 8px;
      font-weight: bold;
    }

    .footer {
      width: 85%;
    }

    .category-list {
      overflow-x: hidden;
    }

    .cart-bar {
      font-family: var(--regular-font);
      border-left: 1px solid var(--light-gray);
      position: fixed;
      top: 80px;
      right: 0px;
      height: 100%;
      width: 350px;
      background-color: white;
    }

    .cart-content {
      width: 100%;
    }

    .shop {
      margin-left: 15%;
      margin-right: calc(350px + 15%);
    }

    .nav-btn {
      top: 25%;
      border-radius: 20px;
      width: 30px;
      height: 30px;
    }
  }

  @media screen and (max-width: 990px) {

    .to-top-container {
      width: 30px;
      height: 40px;
      bottom: 2vh;
      right: 2vw;
    }

    .category-container, .category-list {
      height: 60px;
      padding-right: 25px;
      padding-left: 25px;
    }

    .menu-selector {
      font-size: 16px;
      padding: 5px 10px;
      font-weight: bold;
    }

    .category-name {
      font-size: 24px;
    }

    .footer {
      width: 100%;
    }

    .category-list {
      overflow-x: auto;
    }

    .cart-bar {
      visibility: hidden;
    }

    .cart-content {
      width: 0px;
    }

    .shop {
      margin-left: 2%;
      margin-right: 2%;
    }

    .nav-btn {
      top: 32%;
      border-radius: 13px;
      width: 25px;
      height: 25px;
    }
  }

</style>
