<template>
  <div class="order_detail_banner_wrap">
    <div class="banner_body">
      <div class="banner_body_left">
        <img
          class="avatar"
          :src="order.shop_thumb"
          alt=""
        >
      </div>
      <div class="banner_body_mid">
        <button class="shop-name-btn" @click="onShopNameClick">
          <h3 class="text-truncate">{{order.shop_name}}</h3>
        </button>
        <p>{{$t('payment_result.order_num')}}: {{order.order_id}}</p>
        <p>{{$t('order.order_date')}}: {{order.order_time}}</p>

        <p v-if="order.payment_type === 'cashpay'">{{$t('payment_status.cash')}}</p>
        <p v-else>
          {{$t('payment_status.payment_status')}}:
          <span v-if="paymentStatusIdx === 0">{{$t('payment_status.timeout')}}</span>
          <span v-else-if="paymentStatusIdx === 1">{{$t('payment_status.upapaid')}}</span>
          <span v-else-if="paymentStatusIdx === 2">{{$t('payment_status.prepaid')}}</span>
          <span v-else-if="paymentStatusIdx === 3">{{$t('payment_status.paid')}}</span>
          <span v-else-if="paymentStatusIdx === 4">{{$t('payment_status.refund')}}</span>
          <span v-else-if="paymentStatusIdx === 5">{{$t('payment_status.failed')}}</span>
          <span v-else-if="paymentStatusIdx === 6">{{$t('payment_status.waiting_adjust')}}</span>
        </p>

      </div>
      <div class="banner_body_right">
        <h3>${{order.order_total}}</h3>
        <p>{{deliveryTypeStr}}</p>
        <button v-if="isShowPay && !isShowStripPayment"
                class="red_btn order_again_btn"
                @click="onPressPayAgain"
        >{{$t('order.pay')}}
        </button>

        <button v-if="highlightTabIdx === 3" class="red_btn receipt-button" @click="onPressSendReceipt">
          <img src="../../assets/payment/icon_receipt@2x.png" style="width: 20px; height: 20px;">
          {{$t('order.receipt')}}
        </button>
      </div>
    </div>

    <div class="payment-cell" v-if="isShowPay && isShowStripPayment">
      <PaymentCard style="margin-top: 20px"
                   :amount="order.order_total"
                   @onTokenCreated="onTokenCreated"
                   @sendElRef="setPaymentElRef"

      />
      <button class="red_btn pay-button"
              @click="onPressPay"
      >{{$t('order.pay')}}
      </button>
    </div>

    <div class="tab_group">
      <div :class="(highlightTabIdx === 0)? 'red_btn': ''">{{$t('order.processing')}}</div>
      <div :class="(highlightTabIdx === 1)? 'red_btn': ''">{{$t('order.cooking')}}</div>
      <div v-if="order.shipping_type === 'delivery'" :class="(highlightTabIdx === 2)? 'red_btn': ''">
        {{$t('order.delivering')}}
      </div>
      <div v-if="order.shipping_type === 'pickup'" :class="(highlightTabIdx === 2)? 'red_btn': ''">
        {{$t('order.wait_pickup')}}
      </div>
      <div :class="(highlightTabIdx === 3)? 'red_btn': ''">{{$t('order.finished')}}</div>
    </div>

    <EmailModal
      v-on:sendReceiptEmail="sendReceiptEmail($event)"
      :id="'email-modal'"
      :title="$t('order.receipt')"
      :content="$t('order.send_receipt')"
      :result="sendResult"
    />
  </div>
</template>

<script lang="ts">

  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
  import {OrderHistory} from "@/module/interface/OrderHistory";
  import {OrderDetailLogic} from "@/logic/orderDetailLogic/OrderDetailLogic";
  import {ExistedAddrBook} from "@/module/interface/AddrBook";
  import {DeliveryType} from "@/module/enum/DeliveryType";
  import {OrderStatus} from "@/module/enum/OrderStatus";
  import PaymentCard from "@/components/baseComponents/PaymentCard.vue";
  import {PaymentLogicV1} from "@/logic/paymentLogic/PaymentLogicV1";
  import {StripeCardToken} from "@/module/interface/StripeCardToken";
  import EmailModal from "@/components/orderDetail/EmailModal.vue";

  @Component({
    components: {PaymentCard,EmailModal}
  })
  export default class OrderDetailBanner extends Vue {
    @Prop() private order!: OrderHistory;
    private isShowPay = this.order.status === OrderStatus.STATUS_PAYPENDING
    private deliveryTypeStr: string = this.getDeliveryTypeStr();
    private isShowStripPayment = false;
    private stripePaymentElRef!: any;
    private sendResult = 9


    @Watch('order')
    onPropertyChanged() {
      this.highlightTabIdx = OrderDetailLogic.getInstance().getOrderStatusIdx(this.order.status);// used to control highlight within tabs group
      this.paymentStatusIdx = OrderDetailLogic.getInstance().getPaymentStatusIdx(this.order.payment_status);
      this.deliveryTypeStr = this.getDeliveryTypeStr();
      this.isShowPay = this.order.status === OrderStatus.STATUS_PAYPENDING
    }

    private highlightTabIdx: number = OrderDetailLogic.getInstance().getOrderStatusIdx(this.order.status);// used to control highlight within tabs group
    private paymentStatusIdx: number = OrderDetailLogic.getInstance().getPaymentStatusIdx(this.order.payment_status);

    mounted() {
    }

    onShopNameClick() {
      this.$emit('onShopNameClick');
    }

    setPaymentElRef(ref: any) {
      this.stripePaymentElRef = ref
    }


    onPressPayAgain() {
      this.isShowStripPayment = true
    }

    onTokenCreated(token: StripeCardToken) {
      this.$emit('onTokenCreated', token)
    }

    onPressPay(){
      this.$emit("onPayPressed", this.stripePaymentElRef)
    }

    getDeliveryTypeStr(): string {
      switch (this.order.shipping_type) {
        case DeliveryType.Delivery:
          return this.$t('order.delivery') as string;
        case DeliveryType.Pickup:
          return this.$t('order.pick_up') as string;
        default:
          return '';
      }
    }

    onPressSendReceipt(){
      this.$root.$emit('bv::show::modal', 'email-modal')
    }

    sendReceiptEmail(email: string) {
      OrderDetailLogic.getInstance().sendReceipt(this.order.order_id, email).then((r)=>{
        this.sendResult = r
      }).catch( e => console.log(e))
    }

  }
</script>

<style scoped>

  @media screen and (max-width: 450px) {

    .text-truncate {
      font-size: 20px;
      max-width: 50vw;
    }
    p {
      font-size: 12px;
    }
    .order_again_btn {
      width: 100px;
      height: 34px;
      font-size: 14px;
    }
    .pay-button {
      width: 40px;
      height: 34px;
      font-size: 12px;
    }
    .receipt-button {
      font-size: 14px;
      height: 34px;
      width: 100px;
    }
    .tab_group > div {
      font-size: 12px;
    }
  }

  @media screen and (min-width: 451px)  and (max-width: 600px) {

    .text-truncate {
      font-size: 24px;
      max-width: 55vw;
    }
    p {
      font-size: 12px;
    }
    .order_again_btn {
      width: 120px;
      height: 34px;
      font-size: 16px;
    }
    .pay-button {
      width: 40px;
      height: 34px;
      font-size: 12px;
    }
    .receipt-button {
      height: 34px;
      width: 120px;
    }
    .tab_group > div {
      font-size: 12px;
    }
  }

  @media screen and (min-width: 601px) {

    .text-truncate {
      font-size: 28px;
      max-width: 62vw;
    }
    p {
      font-size: 14px;
    }
    .order_again_btn {
      width: 140px;
      height: 36px;
      font-size: 16px;
    }
    .pay-button, .receipt-button {
      width: 140px;
      height: 36px;
      font-size: 16px;
    }
    .tab_group > div {
      font-size: 16px;
    }
  }

  p {
    color: #999999;
    margin-bottom: 5px;
  }

  .order_again_btn {
    border-radius: 5px;
    border: none;
  }

  .order_detail_banner_wrap {
    padding: 20px;
  }

  .banner_body {
    display: flex;
  }

  .banner_body_left {
    flex: 18%;
    max-width: 18%;
  }

  .avatar {
    width: 60px;
    height: 60px;
  }

  .banner_body_mid {
    flex: 55%;
    max-width: 55%;
    text-align: left;
  }

  .banner_body_right {
    flex: 27%;
    max-width: 27%;
    text-align: right;
  }

  .red_btn {
    background-color: var(--theme-red) !important;
    color: white;
    border-width: 0;
    outline: 0;
    border-radius: 5px;
  }

  .tab_group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    border-radius: 18px;
    background-color: #F2F2F2;
  }

  .tab_group > div {
    width: 25%;
    height: 36px;
    border-radius: 18px;
    background-color: #F2F2F2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .shop-name-btn {
    outline: 0;
    border: 0;
    background-color: white;
  }

  .payment-cell {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .text-truncate{
    margin-left: -5px;
  }

</style>
