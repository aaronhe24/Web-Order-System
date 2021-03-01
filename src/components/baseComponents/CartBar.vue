<template>
  <div>
    <b-button class="cart-button" @click="onCartClick" v-if="cartCounter > 0">
      <img src="../../assets/cart/icon_cart@2x.png" class="img">
      <div class="cart-text" style="margin-right: 10px">{{$t('cart.cart')}}</div>
      <div class="cart-text">{{this.cartCounter.toString()}}</div>
    </b-button>
    <b-modal  ref="cartModal" id="cart"
              modal-class="my-modal"
              hide-footer no-fade
              hide-header hide-backdrop>
      <div class="cart-container">
        <img src="../../assets/icon_dismiss@2x.png" class="close_btn" @click="hideCartModal">
        <InnerCartBar :checkoutFollow="true" @change="onCartChanged" @onCheckout = "hideCartModal"/>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  library.add(faShoppingCart)
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {counter, library} from "@fortawesome/fontawesome-svg-core";
  import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
  import CartCell from "@/components/cart/CartCell.vue";
  import InnerCartBar from "@/components/cart/InnerCartBar.vue";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import {PaymentInfo} from "@/module/interface/PaymentInfo";

  Vue.component('font-awesome-icon', FontAwesomeIcon)
  @Component({
    components: {InnerCartBar, CartCell}
  })
  export default class CartBar extends Vue {
    private isShow:boolean = false
    private cart: SyncApiCart = SyncApiCart.getInstance();
    private isShowButton = this.cart.getCartCounter() > 0;
    private cartCounter = this.cart.getCartCounter();
    private disableClickList = ["ShopOrderView", "PaymentView"];


    mounted() {


    }

    @Watch('cart', {deep: true})watchCart(newValue:PaymentInfo, oldValue:PaymentInfo){
      this.cartCounter = this.cart.getCartCounter();
    }

    onCartChanged(counter: number){
      this.isShowButton = counter > 0;
    }

    disableClick():boolean{
      let disableShopOrder = this.$route.name === "ShopOrderView" && window.innerWidth > 991
      let disablePayment = this.$route.name === "PaymentView"
      return disableShopOrder || disablePayment
    }

    onCartClick(){
      //固定值，之后会写枚举存放
      if(this.disableClick()){
        return;
      }
      this.isShow = !this.isShow
      if(this.isShow){
        this.$bvModal.show("cart")
      }else {
        this.$bvModal.show("cart")
      }
    }

    hideCartModal (){
      this.$bvModal.hide("cart")
    }


  }
</script>

<style scoped>

  .close_btn {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 20px;
    right: 20px;
  }

  .icon {
    color: orangered;
    position: center;
  }
  .counter{
    position: absolute;
    text-align: center;
  }



  @media screen and (min-width: 576px) {
    /deep/ .my-modal > .modal-dialog {
      top: 50px;
      right: 2%;
    }
    .cart-container{
      height: 700px;
    }
  }

  @media screen and (max-width: 575px) {
    /deep/ .my-modal > .modal-dialog {
      top: 0px;
      bottom: 0px;
      left: 3%;
      right: 3%;
    }
    .cart-container{
      height: 500px;
    }

  }

  /deep/ .my-modal > .modal-dialog {
    position: absolute;
    width: 90%;
    /*top: 0px;*/
    /*bottom: 0px;*/
    /*left: 3%;*/
    /*right: 3%;*/
    overflow-y: auto;
    box-shadow: black;
  }

  .cart-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    /*width: 107px;*/
    /*height: 36px;*/
    padding: 7px 10px;
    background-color: var(--theme-red);
    border-width: 0;
    outline: 0;
  }

  .img{
    align-items: center;
    justify-content: center;
    width: 18px;
    /*height: 20px;*/
    margin-right: 15px;
  }

  .cart-text{
    font-weight: bold;
  }



</style>
