<template>
    <div class="shop-detail">

      <div>
        <carousel class="gallery-carousel" v-if="shopDetail.gallery" :per-page="1" adjustableHeight
                  :mouse-drag="true" :autoplay="true" :loop="true" :paginationPosition="'bottom-overlay'">
          <slide v-for="(img,index) in shopDetail.gallery" :key="index" class="img-slide">
            <img class="shop-bg" :src="img" alt="">
          </slide>
        </carousel>

        <img class="shop-bg" v-else
             :src="shopDetail.preview_img ? shopDetail.preview_img : require(`../../assets/shop/shop_default_img@2x.png`)"
             alt="">
        <img class="shop-icon" :src=" shopDetail.thumb_small ? shopDetail.thumb_small : require(`../../assets/shop/dish_default_img@2x.png`)" alt="">
        <h1 class="title">{{shopDetail.name}}</h1>
        <div class="tags-container">
<!--          <div class="tags" :style="{'background-color':item.color}" v-for="item in shopDetail.tags">-->
<!--            {{item.tag}}-->
<!--          </div>-->
          <div class="tags" v-for="item in shopDetail.tags">
            {{item.tag}}
          </div>
        </div>
      </div>


      <div class="shop-info-container">
        <div style="display: flex;flex-direction: row;">
          <div class="min-spend">
            <img style="margin-right: 5px; width: 20px; height: 20px" src="../../assets/shop/icon_min_spend@2x.png" alt="">
            <div style="margin-right: 15px" class="label">{{$t('shop.min_spend')}}</div>
            <div style="font-family: var(--bold-font)" class="label">{{"$" + shopDetail.min_amount.toFixed(1)}}</div>
          </div>
          <div class="cooking-time">
            <img style="margin-right: 5px; width: 20px; height: 20px" src="../../assets/shop/icon_cooking_time@2x.png" alt="">
            <div style="margin-right: 15px" class="label">{{$t('shop.cooking_time')}} </div>
            <div style="font-family: var(--bold-font)" class="label">{{shopDetail.cooking_minutes + " Min"}}</div>
          </div>
        </div>
        <div class="delivery-type">
          <button class="btn" :class="deliveryActive ? 'btn-active' : null"
                  v-if="currentPickupStatus === 0 || currentPickupStatus === 1"
                  @click="onClickChangeDelivery('delivery')">
                  {{$t('payment.delivery')}}
          </button>
          <button class="btn" :class="pickupActive ? 'btn-active' : null"
                  :disabled="currentPickupStatus === 0"
                  @click="onClickChangeDelivery('pickup')">
                  {{$t('payment.pickup')}}
          </button>
        </div>
      </div>

      <AlertModal id="change-delivery"
                  :okOnly="true"
                  :title="$t('common.alert')"
                  :content="$t('shop.change_delivery_alert')"
                  v-on:onPressOK="onConfirmChangeDelivery(newDeliveryType)"/>

    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {ShopDetail} from "@/module/interface/ShopDetail";
  import {ShippingType} from "@/module/interface/ShippingType";
  import {DeliveryType} from "@/module/enum/DeliveryType";
  import AlertModal from "@/components/baseComponents/AlertModal.vue";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";

    @Component({
      components:{
        AlertModal
      }
    })
    export default class ShopDetailCardCell extends Vue {
        @Prop() private shopDetail!:ShopDetail
        @Prop() private deliveryType!: string
        @Prop() private pickupStatus!: number
        private deliveryActive = this.deliveryType === DeliveryType.Delivery
        private pickupActive = this.deliveryType === DeliveryType.Pickup
        private newDeliveryType !:string
        private currentPickupStatus = this.pickupStatus
        // private cart: SyncApiCart = SyncApiCart.getInstance();

      @Watch('deliveryType')checkStatus(newValue:string,oldValue:string){
        this.deliveryActive = newValue === DeliveryType.Delivery
        this.pickupActive = newValue === DeliveryType.Pickup
      }

      @Watch('pickupStatus')checkPickStatus(newValue:number,oldValue:number){
        this.currentPickupStatus = newValue
      }

      mounted() {

      }

      onClickChangeDelivery(type:string){
          if(type !== this.deliveryType){
            this.$root.$emit('bv::show::modal', 'change-delivery');
            this.newDeliveryType = type
          }
      }

      onConfirmChangeDelivery(type:string){
         if(type === DeliveryType.Delivery){
           this.onClickDeliveryBtn()
         }else {
           this.onClickPickupBtn()
         }
      }

      onClickDeliveryBtn(){
        this.deliveryActive = true
        this.pickupActive = false
        this.$emit('onChangeDelivery',ShippingType.DELIVERY)
      }

      onClickPickupBtn(){
        this.deliveryActive = false
        this.pickupActive = true
        this.$emit('onChangeDelivery',ShippingType.PICKUP)
      }

    }
</script>

<style scoped>

  @media screen and (min-width: 576px) {

    .label {
      font-size: 16px;
    }
    .shop-icon {
      left: 40px;
      top: 240px;
    }
    .shop-bg {
      height: 300px;
    }
    .shop-info-container{
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  @media screen and (max-width: 575px) {

    .label {
      font-size: 14px;
    }
    .shop-icon {
      left: 20px;
      top: 140px;
    }
    .shop-bg{
      height: 200px;
    }
    .title {
      font-size: 24px;
    }
    .shop-info-container{
      flex-direction: column;
      align-items: flex-start;
    }
    .delivery-type{
      margin-top: 20px;
    }
  }

  .shop-detail {
    font-family: var(--regular-font);
  }

  .gallery-carousel {

  }

  .img-slide {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .shop-bg {
    width: 100%;
    object-fit: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .shop-icon {
    width: 78px;
    height: 78px;
    border-radius: 10px;
    box-shadow: 1px 1px 5px darkgray;
  }

  .shop-icon{
    position: absolute;
  }

  .title {
    margin-top: 40px;
    text-align: left;
  }

  .tags-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .tags {
    background-color: var(--light-gray);
    height: 20px;
    font-size: 12px;
    margin-right: 10px;
    margin-bottom: 5px;
    padding:2px 8px;
    color: var(--dark-gray);
  }

  .shop-info-container {
    margin-top: 25px;
    display: flex;
  }

  .min-spend {
    margin-right: 35px;
  }

  .min-spend, .cooking-time {
    display: flex;
    flex-direction: row;
  }

  .delivery-type{
    display: flex;
    height: 36px;
    border-radius: 18px;
    border: 1px solid var(--light-gray);
  }

  .btn {
    flex: 50%;
    border: none;
    border-radius: 18px;
    color: var(--dark-gray);
    max-width: 84px;
  }

  .btn-active {
    color: white;
    background-color: var(--theme-red);
  }

  .btn:active {
    border: none;
  }

</style>
