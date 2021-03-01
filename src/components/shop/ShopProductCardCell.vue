<template>
  <div class="shop-card" @click="$emit('onClickDetail',product)">
      <div class="dish-info">
        <div style="display: flex;align-items: flex-start;flex-direction: column;">
          <span :class="product.product_image ? 'title' : 'long-title'">{{product.product_name}}</span>
          <!--        <p class="desc">{{str.substring(0,100) + "..."}}</p>-->
          <p :class="product.product_image ? 'desc' : 'long-desc'">{{product.product_desc ? product.product_desc : ""}}</p>

        </div>
        <div class="price-cell" v-if="!product.hasOption()">
          <OrgPriceCell style="margin-top: 13px" :price="product.org_price" :color="'var(--dark-gray)'"
                        v-if="hasDiscount"
          />
          <div>{{'$'+product.price.toFixed(2)}}</div>
        </div>
        <div class="custom-cell" v-if="product.hasOption()">
          {{$t('shop.customized')}}
        </div>
      </div>

      <img v-show="product.product_image" class="dish-img" :src="product.product_image" alt="">
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faUserSecret,faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {Product} from "@/module/Product";
  import OrgPriceCell from "@/components/cart/OrgPriceCell.vue";

  library.add(faUserSecret,faPlusSquare,faMinusSquare)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  @Component({
    components: {OrgPriceCell}
  })
  export default class ShopProductCardCell extends Vue {
    @Prop() private product!: Product;
    private hasDiscount = this.product.hasSpecialOffer();

    @Watch('product', {deep:true})watchPdt(value:Product){
      this.hasDiscount = value.hasSpecialOffer()
    }

    mounted () {
      // console.log("Qty:",this.product.qty)
    }
  }


</script>

<style scoped>

  @media screen and (max-width: 990px) {
    .shop-card {
      flex: 98%;
      max-width: 98%;
    }
    .title{
      width: 55vw;
      font-weight: bold;
    }

    .title{
      width: 55vw;
    }
    .long-title {
      max-width: 82vw;
      font-weight: bold;
    }

     .long-desc {
      max-width: 82vw;
    }
  }

  @media screen and (min-width:991px) and (max-width: 1650px){
    .shop-card {
      flex: 95%;
      max-width: 95%;
    }
    .title{
      width: 25vw;
      font-weight: bold;

    }
     .desc{
      width: 25vw;
    }

    .long-title{
      width: 25vw;
      font-weight: bold;
    }

    .long-desc{
      width: 25vw;
    }
  }

  @media screen and (min-width:1651px) and (max-width: 1920px){
    .shop-card {
      flex: 47%;
      max-width: 47%;
    }
    .title{
      width: 13vw;
      font-weight: bold;
    }

     .desc{
      width: 13vw;
    }
    .long-title {
      max-width: 18vw;
      font-weight: bold;
    }

    .long-desc {
      max-width: 18vw;
    }
  }

  @media screen and (min-width: 1921px){
    .shop-card {
      flex: 46%;
      max-width: 46%;
    }
    /*.title{*/
    /*  width: 15vw;*/
    /*  max-width: 300;*/
    /*}*/
    /*.long-title {*/
    /*  max-width: 18vw;*/
    /*}*/

    /* .desc{*/
    /*  width: 15vw;*/
    /*}*/
    /*.long-desc {*/
    /*  max-width: 18vw;*/
    /*}*/
  }

  .shop-card {
    position: relative;
    border: 1px solid var(--light-gray);
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px;
    justify-content: space-between;
    font-family: var(--regular-font);
    cursor: pointer;
    min-height: 120px;
  }

  .title,.long-title {
    text-align: left;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    font-weight: bold;
  }


  .desc, .long-desc {
    font-size: 12px;
    color: var(--gray);
    text-align: left;
    margin-right: 20px;
    max-height: 35px;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }

  .long-desc {
    max-height: 50px;
  }

  .dish-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    min-height: 90px;
    flex:100%
  }

  .dish-img {
    width: 90px;
    height: 90px;
    object-fit: cover;
  }

  .price-cell{
    display: flex;
    flex-direction: row;
    justify-items: center;
    font-weight: bold;
  }

  .custom-cell{
    display: flex;
    flex-direction: row;
    justify-items: center;
    border-radius: 25px;
    background-color: var(--theme-red);
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    color: white;
    font-size: 12px;
  }

  .icon{
    margin: 20px;
  }

</style>
