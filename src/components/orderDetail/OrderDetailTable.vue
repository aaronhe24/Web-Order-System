<template>
  <div>
    <h4>{{$t('payment_result.order_detail')}}</h4>
    <order-detail-cell
      :label="$t('order.subtotal')"
      :price="subtotal"
    ></order-detail-cell>
    <order-detail-cell
      :label="$t('order.delivery_fee')"
      :price="deliveryFee"
    ></order-detail-cell>
    <order-detail-cell
      :label="$t('order.fees_and_estimated_tax')"
      :price="feesAndEstimatedTax"
    ></order-detail-cell>
    <!--    <order-detail-cell-->
    <!--      :label="$t('order.payment_processing_fees')"-->
    <!--      :price="paymentProcessingFees"-->
    <!--    ></order-detail-cell>-->
    <div class="cell_body ">
        <div class="cell_left">
          {{$t('order.payment_processing_fees')}}
          <img src="../../assets/payment/icon_tips_hint.png" alt=""
               @click="onClickService"
               class="icon">
        </div>
        <div class="cell_right"
             v-if="parseFloat(paymentProcessingFees) > 0"
        >
          ${{paymentProcessingFees}}
        </div>
    </div>
    <div class="detail-text"
         style="color: var(--gray); font-size: 12px"
         v-if="isShowServiceDesc"
    >{{serviceFeeDesc}}</div>
    <base-line/>
    <order-detail-cell
      :label="$t('order.discount')"
      :price="discount"
    ></order-detail-cell>
    <order-detail-cell
      :label="$t('order.tips')"
      :price="tips"
    ></order-detail-cell>

    <div class="cell_body total">
      <div class="cell_left">
        {{$t('order.total')}}
      </div>
      <div class="cell_right">
        ${{total}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import OrderDetailCell from "@/components/orderDetail/OrderDetailCell.vue";
  import BaseLine from "@/components/baseComponents/BaseLine.vue";
  @Component({
    components: {BaseLine, OrderDetailCell}
  })

  export default class OrderDetailTable extends Vue {
    @Prop() private subtotal!: number;
    @Prop() private deliveryFee!: number;
    @Prop() private feesAndEstimatedTax!: number;
    @Prop() private paymentProcessingFees!: number;
    @Prop() private serviceFeeDesc!: string;
    @Prop() private discount!: number;
    @Prop() private tips!: number;
    @Prop() private total!: number;
    private isShowServiceDesc = false;



    onClickService(){
      this.isShowServiceDesc = !this.isShowServiceDesc
    }
  }
</script>

<style scoped>

  .cell_body {
    display: flex;
    padding: 20px 0;
  }
  .detail-text {
    color: var(--dark-black);
    font-size: 14px;
  }

  .gray_bot_border {
    border-bottom: 1px gainsboro solid;
  }

  .cell_body {
    display: flex;
    padding: 10px 0;
  }

  .cell_left {
    flex: 75%;
    max-width: 75%;
  }

  .cell_right {
    flex: 25%;
    max-width: 25%;
    text-align: right;
  }

  p {
    margin-bottom: 3px;
  }

  .cell_left {
    flex: 75%;
    max-width: 75%;
  }

  .cell_right {
    flex: 25%;
    max-width: 25%;
    text-align: right;
  }

  .icon{
    width: 17px;
    height: 17px;
    margin-left: 15px;
  }


  .total > div {
    font-size: 20px;
    font-weight: bold;
  }
</style>
