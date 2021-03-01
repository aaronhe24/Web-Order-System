<template>
<!--  <div v-if="this.cart.getCartCounter() >0" class="cart-container">-->
  <div class="cart-container">
    <header style="text-align: left">
<!--      <h4 class="title" v-if="this.cart.getCartCounter() < 1">{{$t('cart.cart_empty')}}</h4>-->
      <h4 class="title" >{{$t('cart.cart')}}</h4>
    </header>

    <NoDataView style="margin: 50px 20px"
                :content="$t('cart.cart_empty')"
                v-if="this.cart.getCartCounter() < 1"/>

    <div v-else class="list-container">
      <div v-for="(product, index) in productList" class="productList">
        <CartCell :product="product" v-on:onRmProductClick="removeProductFromCart"/>
        <base-line style="padding-left: 15px" v-if="index !== productList.length-1"/>
        <CartCell  :product="gift" v-if="cart.getShopFullAmountGifts() && index === productList.length-1 "/>
      </div>
    </div>
    <div :class="checkoutFollow ? 'checkoutFollow' : 'checkout'">
      <div class="full-amount-hint"
           v-if="isShowDiscountHint">
        <div class="full-amount-hint-text"  v-if="!isShowGiftHint">
          {{$t('cart.more_discount1')}} ${{cart.getAvailableNextHit()}}
          {{$t('cart.more_discount2')}}，{{$t('cart.discount1')}} ${{cart.getNextSaleAmount()}}
          {{$t('cart.discount2')}}
        </div>
        <div class="full-amount-hint-text" v-if="isShowGiftHint">
          {{$t('cart.more_discount1')}} ${{cart.getAvailableNextHit()}}
          {{$t('cart.more_discount2')}}，{{$t('cart.discount1')}} {{cart.getNextAvailableGifts()}}
        </div>
      </div>

      <b-button  v-if="isShopOpen === 0" class="disable-checkout-btn" @click="onPressCheckOut" disabled>
        <div class="price-container">
          {{$t('cart.closed')}}
        </div>
      </b-button>

      <b-button  v-else class="checkout-btn" @click="onPressCheckOut" :class="isReachLimit ? null : 'under-limit'">
        <div class="checkout-text">{{$t('cart.checkout')}}</div>
        <div class="price-container">
          <OrgPriceCell :color="'white'" :price="cart.getOrgSubTotal()" v-if="cart.hasDiscount()"/>
          <div class="checkout-text" >${{subtotal}}</div>
        </div>
      </b-button>

    </div>

    <AlertModal id="min-spend-alert"
                :okOnly="true"
                :title="$t('common.alert')"
                :content="$t('cart.min_spend_alert') + '$' + this.cart.getOrderMinSubtotal()"
                v-on:onPressOK="$root.$emit('bv::hide::modal', 'min-spend-alert')"/>

  </div>

</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

  library.add(faShoppingCart)
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {library} from "@fortawesome/fontawesome-svg-core";
  import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
  import {Product} from "@/module/Product";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import CartCell from "@/components/cart/CartCell.vue";
  import BaseLine from "@/components/baseComponents/BaseLine.vue";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  import {PaymentLogicV1} from "@/logic/paymentLogic/PaymentLogicV1";
  import {PaymentInfo} from "@/module/interface/PaymentInfo";
  import OrgPriceCell from "@/components/cart/OrgPriceCell.vue";
  import NoDataView from "@/components/baseComponents/NoDataView.vue";
  import AlertModal from "@/components/baseComponents/AlertModal.vue";
  import {AddrBookLogic} from "@/logic/addrBookLogic/AddrBookLogic";

  Vue.component('font-awesome-icon', FontAwesomeIcon)
  @Component({
    components: {OrgPriceCell, BaseLine, CartCell, NoDataView, AlertModal}
  })
  export default class InnerCartBar extends Vue {
    //判断checkout按钮是沉底还是跟随scrollView
    @Prop() private checkoutFollow!: boolean;
    private cart: SyncApiCart = SyncApiCart.getInstance();
    private productList: Product[] = this.cart.getCart();
    private globalSetting: GlobalSettingPreference = GlobalSettingPreference.getInstance();
    private subtotal: number = this.cart.getSubTotal();
    private isShowGiftHint = this.cart.getNextAvailableGifts() && !this.cart.getNextSaleAmount();
    private gift: Product = this.initGift(this.cart.getShopFullAmountGifts());
    private isShowDiscountHint: boolean = false
    private enableCheckout: boolean = this.cart.enableCheckout();
    private isShopOpen = this.cart.getShopDetail() ? this.cart.getShopDetail().open : 1
    private isReachLimit = this.enableCheckout

    @Watch('cart', {deep:true})watchCart(value: SyncApiCart, oldValue: SyncApiCart){
      this.productList = value.getCart();
      this.subtotal = value.getSubTotal();
      this.isShowGiftHint = value.getNextAvailableGifts() && !value.getNextSaleAmount()
      this.initGift(value.getShopFullAmountGifts())
      this.isShowDiscountHint =
        this.cart.getAvailableNextHit() >=0 && this.subtotal !==0
      this.enableCheckout = this.cart.enableCheckout() ;
    }

    @Watch('subtotal')watchSubTotal(value: number){
      this.subtotal = value;
    }

    @Watch('isOpen')watchOpen(value: number){
      this.isShopOpen =  this.cart.getShopDetail().open
    }

    @Watch('enableCheckout')watchMinSpend(value: number){
      this.isReachLimit = this.enableCheckout
    }

    mounted() {

    }

    initGift(name: string){
      this.gift = new Product()
      if(!name){
        return this.gift
      }
      this.gift.product_name = this.$t('cart.gift') + " " +  name;
      this.gift.qty = -1;
      return  this.gift;
    }
    removeProductFromCart(p: Product) {
      if (!this.cart) {
        return;
      }
      this.cart.removeProductFromCart(p);
    }

    onPressCheckOut(){
      if(!this.enableCheckout){
        this.$root.$emit('bv::show::modal', 'min-spend-alert')
        return
      }
      const hasUser = this.globalSetting.getUser().cid;
      const hasAddress = this.globalSetting.getUser().address
      !hasUser ?  this.goToLogin()
        : (hasAddress ? this.goToPaymentView() : this.goToAddress())  ;
      this.$emit("onCheckout")
    }


    goToLogin(){
      this.$router.push('signIn')
    }

    goToAddress(){
      AddrBookLogic.getInstance().setEnableSelect(1)
      this.$router.push(
        {
          name: 'AddrBook',
          query: {
            enableSelect: "1"
          },
        })
    }

    goToPaymentView(){
      this.$router.push('payment')
    }


  }
</script>

<style scoped>

  @media screen and (min-width: 991px) {
    .list-container {
      height: 65vh;
    }
  }

  @media screen and (max-width: 990px) {
    .list-container {
      height: 70%;
    }
  }

  /*.cart-container {*/
  /*  !*border: 1px solid black;*!*/
  /*  !*position: relative;*!*/
  /*  !*height: 100%;*!*/
  /*  !*width: 100%;*!*/
  /*  !*display: flex;*!*/
  /*  !*flex-direction: column;*!*/
  /*  !*justify-items: flex-start;*!*/
  /*  !*background-color: white;*!*/
  /*}*/

  .list-container {
    margin-bottom: 0px;
    width: 100%;
    padding-right: 5%;
    border-bottom-color: var(--light-gray);
    border-width: 1px;
    background-color: white;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .title {
    margin-top: 20px;
    margin-left: 20px;
    font-weight: bold;
    color: var(--dark-black);
  }

  .box {
    flex: 100%;
  }

  .checkout-text {
    font-size: 14px;
  }

  .checkout {
    position: absolute;
    bottom: 120px;
    width: 80%;
    margin-top: 120px;
    margin-left: 10%;
    margin-right: 10%;
  }

  .checkoutFollow {
    position: absolute;
    width: 85%;
    bottom: 20px;
    margin-top: 30px;
    margin-left: 5%;
    margin-right: 5%;
  }

  .checkout-btn,.disable-checkout-btn{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--theme-red);
    outline: 0;
    border-width: 0;
    border-radius: 5px;
    height: 60px;
    width: 100%;
  }

  .disable-checkout-btn{
    background-color: var(--light-gray);
  }

  .full-amount-hint{
    width: 90%;
    background-color: var(--border-color);
    border-radius: 5px;
    margin-right: 15px;
    margin-left: 15px;
    margin-bottom: -8px;
    padding-bottom: 8px;
    z-index: -1;
  }
  .full-amount-hint-text{
    color: var(--theme-red);
    font-size: 12px;
  }
  .productList {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .price-container{
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  .slash{
    margin-bottom: -9px;
    background-color: var(--dark-gray);
  }

  .org-price-container{
    display: flex;
    flex-direction: column;
    margin-right: 10px
  }

  .under-limit {
    background-color: var(--dark-gray);
  }



</style>
