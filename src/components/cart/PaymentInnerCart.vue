<template>
  <div v-if="this.cart.getCartCounter() >0" class="container">
    <header style="display: flex; width: 100%">
      <div class="title" >{{orderSummaryTitle}}</div>
    </header>
    <div class="list-container">
      <div v-for="(product, index) in productList" class="productList">
        <CartCell :product="product" v-on:onRmProductClick="removeProductFromCart"/>
        <base-line style="padding-left: 15px" v-if="index !== productList.length-1"/>
        <CartCell  :product="gift" v-if="gift.qty === -1 && index === productList.length-1"/>
      </div>
    </div>
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

  Vue.component('font-awesome-icon', FontAwesomeIcon)
  @Component({
    components: {BaseLine, CartCell}
  })
  export default class PaymentInnerCart extends Vue {
    @Prop() private orderSummaryTitle!:string
    @Prop() private productList!: Product[]
    @Prop() private gift!: Product;

    // private productList: Product[] = []
    private cart: SyncApiCart = SyncApiCart.getInstance();

    @Watch('gift', {deep:true})watchCart(value: Product){
       this.gift = value;
    }

    mounted() {

    }




    // getCartProductList(): Product[] {
    //   return this.cart.getCart();
    // }


    removeProductFromCart(p: Product) {
      this.$emit("removeFromCart", p)
;
    }




  }
</script>

<style scoped>

  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-items: center;
    border-bottom-color: #999999;
    border-width: 0.5px;
  }

  .list-container {
    height: 70%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-items: center;
    border-bottom-color: #999999;
    border-width: 0.5px;
    background-color: white;
  }

  .title {
    align-self: flex-start;
    margin-left: 15px;
    font-weight: bold;
    font-size: 24px;
    color: var(--dark-black);
  }

  .productList {
    display: flex;
    flex-direction: column;
    width: 100%;
  }



</style>
