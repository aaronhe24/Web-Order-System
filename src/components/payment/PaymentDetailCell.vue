<template>
  <div v-if="isShowOrderDetail" class="detail-inner">
    <div class="detail-member-cell">
      <div class="detail-text">{{$t('payment.subtotal')}}</div>
      <div class="price-container">
        <OrgPriceCell style="margin-bottom: 2px" :price="org_subtotal" :color="'var(--dark-gray)'"
                      v-if="isShowSubtotalDiscount"
        />
        <div class="detail-text">{{subtotal}}</div>
      </div>
    </div>
    <div class="detail-member-cell"
         v-if="isShowDeliveryFee"
    >
      <div class="detail-text">{{$t('payment.delivery_fee')}}</div>
      <div class="price-container">
        <OrgPriceCell style="margin-bottom: 2px" :price="orgDeliveryFee" :color="'var(--dark-gray)'"
                      v-if="isShowShippingDiscount"
        />
        <div class="detail-text">{{deliveryFee}}</div>
      </div>
    </div>
    <div class="detail-member-cell">
      <div class="detail-text">{{$t('payment.tax')}}</div>
      <div class="detail-text">{{tax}}</div>
    </div>
    <div class="detail-member-cell">
      <div class="detail-text">{{$t('payment.payment_fee')}}
        <img src="../../assets/payment/icon_tips_hint.png" alt=""
             v-if="isShowPaymentHintIcon"
             @click="onHintClicked"
             class="icon"></div>
      <div class="detail-text">{{paymentFee}}</div>
    </div>
    <div class="detail-member-cell"
         style="margin-top: 5px;
    flex-direction: column;
    align-items: flex-start;"

         v-if="isShowPaymentHintText"
    >
      <div class="detail-text" style="color: var(--gray); font-size: 12px">{{paymentFeeDesc}}</div>
      <div class="detail-text" style="color: var(--gray); font-size: 12px"
           v-if="serviceFeeDesc"
      >{{serviceFeeDesc}}</div>
    </div>
    <div class="detail-member-cell" v-if="discount !== ''">
      <div class="detail-text">{{$t('payment.discount')}}</div>
      <div class="detail-text" style="color: var(--theme-red)">{{discount}}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {PaymentInfo} from "@/module/interface/PaymentInfo";
  import {Delivery} from "@/module/respones/Delivery";
  import OrgPriceCell from "@/components/cart/OrgPriceCell.vue";
  import {ShippingType} from "@/module/interface/ShippingType";
  @Component({
    components: {OrgPriceCell}
  })
  export default class PaymentDetailCell extends Vue {
    @Prop() private paymentInfo!: PaymentInfo
    private shippingInfo: Delivery = this.paymentInfo.shippingInfo
    //payment params
    //@ts-ignore
    private subtotal: string = ''
    private org_subtotal: string = ''
    private deliveryFee: string = ''
    private orgDeliveryFee: string = ''
    private tax: string = '';
    private paymentFee: string = ''
    private discount: string = ''
    private serviceFeeDesc = ''
    private paymentFeeDesc = ''
    private isShowOrderDetail = false
    private isShowDeliveryFee = false;
    private isShowSubtotalDiscount = false;
    private isShowShippingDiscount = false;
    private isShowPaymentHintIcon = false;
    private isShowPaymentHintText = false;



    mounted() {
    }

    @Watch('paymentInfo', {deep: true}) watchPaymentInfo(newValue: PaymentInfo, oldValue: PaymentInfo) {
        this.isShowOrderDetail = false
      this.paymentInfo = newValue
      this.subtotal = "$" + newValue.subtotal.toString();
      this.org_subtotal = newValue.org_subtotal.toString()
      this.shippingInfo = newValue.shippingInfo
        //@ts-ignore
      if(this.shippingInfo === []){
          this.orgDeliveryFee =  '0'
          this.deliveryFee = '0'
      }else {
          this.orgDeliveryFee =  this.shippingInfo.org_shipping_fee  ? this.shippingInfo.org_shipping_fee.toString() :''
          this.deliveryFee = "$" + this.shippingInfo.shipping_fee + "(" + this.shippingInfo.distance + "km)";
      }
      this.tax = "$" + newValue.taxFee;
      let s = newValue.paymentFee + newValue.serviceFee
      this.paymentFee = "$" + s;
      this.isShowPaymentHintIcon = newValue.paymentFee + newValue.serviceFee  > 0;
      this.paymentFeeDesc = newValue.paymentFee > 0 ?
        this.$t('payment.credit_card') + " + " + newValue.paymentFee
        : ""
      this.serviceFeeDesc = newValue.serviceFeeDesc;
      this.discount = newValue.discount ? "-$" + this.paymentInfo.discount : ''
      this.isShowOrderDetail = true
        //@ts-ignore
      this.isShowDeliveryFee = newValue.deliveryType === ShippingType.DELIVERY
      this.isShowShippingDiscount = this.hasDiscountShippingFee();
      this.isShowSubtotalDiscount = this.hasDiscount();
    }

    onHintClicked(): boolean{
      return this.isShowPaymentHintText =  !this.isShowPaymentHintText
    }

    hasDiscount() {
      return this.paymentInfo.org_subtotal - this.paymentInfo.subtotal > 0;
    }

    hasDiscountShippingFee() {
      return this.shippingInfo.org_shipping_fee - parseFloat(this.shippingInfo.shipping_fee) >0;
    }
  }
</script>

<style scoped>
  .detail-inner {
    display: flex;
    flex-direction: column;
  }

  .icon{
    width: 17px;
    height: 17px;
    margin-left: 15px;
  }

  .price-container {
    display: flex;
    flex-direction: row;
    min-width: 150px;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .detail-member-cell {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
  }

  .detail-text {
    color: var(--dark-black);
    font-size: 14px;
  }
</style>
