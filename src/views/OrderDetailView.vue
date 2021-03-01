<template>
  <div class="order_detail_view">
    <button class="backspace_btn"
            @click="onClickBackspace">
      <b-icon-backspace style="margin-right: 5px"></b-icon-backspace> {{$t('common.orders_label')}}
    </button>
    <div class="order_detail_view_wrap_with_log">
      <div class="order_detail_left_wrap">
        <order-detail-banner
          :order="order"
          class="gray_border"
          @onShopNameClick="goToShopDetail"
          @onPayPressed="onPayPressed"
          @onTokenCreated = "onTokenCreated"
        ></order-detail-banner>

        <div class="summary_wrap gray_border">
          <h4>{{$t('order.summary')}}</h4>
          <order-detail-summary-cell v-for="(item, idx) in order.order_items"
                                     :item="item"
                                     :key="idx"
                                     :idx="idx"
                                     :len="order.order_items.length"
          ></order-detail-summary-cell>
        </div>

        <order-detail class="summary_wrap gray_border"
                      :subtotal="order.order_subtotal"
                      :deliveryFee="order.only_shipping_fee"
                      :feesAndEstimatedTax="order.order_tax"
                      :paymentProcessingFees="order.service_fee"
                      :service-fee-desc="order.service_fee_desc"
                      :discount="order.order_discount"
                      :tips="order.tips_amount"
                      :total="order.order_total"
        ></order-detail>
        <div class="order_detail_wrap"></div>
      </div>
      <div class="order_detail_right_wrap">
<!--        <div class="map_wrap gray_border">-->
<!--          <div class="map">-->
<!--            <map-view-->
<!--              :markers="[mapMarker]"-->
<!--              :zoom="15"-->
<!--            ></map-view>-->
<!--          </div>-->
<!--          <button>View navigation</button>-->
<!--        </div>-->
        <div v-show="isShowStatusLog" class="status_log_wrap gray_border">
          <log-container
            :title="$t('order.status_log')"
            :logs="order.logs"
          ></log-container>
        </div>
        <div v-show="isShowCouponsLog" class="coupons_log_wrap gray_border">
          <log-container
            :title="$t('order.coupons_log')"
            :logs="order.coupon_logs"
          ></log-container>
        </div>
      </div>
    </div>

    <MaskLoading :isShow="isShowLoading"/>

    <AlertModal id="order-alert"
                :okOnly="true"
                :title="$t('common.alert')"
                :content="alertContent"
                v-on:onPressOK="$root.$emit('bv::hide::modal', 'order-alert')"/>


  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import OrderDetailBanner from "@/components/orderDetail/OrderDetailBanner.vue";
import OrderDetailSummaryCell from "@/components/orderDetail/OrderDetailSummaryCell.vue";
import PaymentDetailCell from "@/components/payment/PaymentDetailCell.vue";
import OrderDetailTable from "@/components/orderDetail/OrderDetailTable.vue";
import LogContainer from "@/components/orderDetail/LogContainer.vue";
import MapView from "@/components/payment/MapView.vue";
import {getNewOrderDetail, OrderDetail} from "@/module/interface/OrderDetail";
import {OrderDetailLogic} from "@/logic/orderDetailLogic/OrderDetailLogic";
import {MapMarker} from "@/module/interface/MapMarker";
import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
import {ApiHelper} from "@/api/ApiHelper";
import {AppHelpers} from "@/common/AppHelpers";
import {PaymentLogicV1} from "@/logic/paymentLogic/PaymentLogicV1";
import {StripeCardToken} from "@/module/interface/StripeCardToken";
import AlertModal from "@/components/baseComponents/AlertModal.vue";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
@Component({
  components: {
    AlertModal,
    MapView, LogContainer, OrderDetail: OrderDetailTable, PaymentDetailCell, OrderDetailSummaryCell, OrderDetailBanner, MaskLoading}
})
export default class OrderDetailView extends Vue {

  private order: OrderDetail = getNewOrderDetail();
  private orderNum: number = parseInt(this.$route.query.orderNum as string);
  private orderDetailLogic = OrderDetailLogic.getInstance();
  private isShowStatusLog: boolean = !(this.order.logs.length === 0);
  private isShowCouponsLog: boolean = !(this.order.coupon_logs.length === 0);
  private isShowLoading =  false
  private settings: GlobalSettingPreference = GlobalSettingPreference.getInstance();
  private alertContent = ""
  private payment = PaymentLogicV1.getInstance();

  private mapMarker: MapMarker = new MapMarker(
    parseFloat(this.order.shop_lat),
    parseFloat(this.order.shop_lng)
  )

  mounted() {
    this.isShowLoading =  true
    window.scrollTo(0, 0);
    this.fetchOrderDetail();

  }

  async fetchOrderDetail() {
    try {
      let rs = await this.orderDetailLogic.fetchOrderDetail(this.orderNum)
      let h = AppHelpers.getInstance()
      if(!h.isLogin(rs)){
        h.goToLogin(this)
        return
      }
      this.order = this.orderDetailLogic.getOrder();
      this.isShowLoading = false
    }catch (e) {
      console.log(e)
    }

  }

  showAlertBox(){
    this.$root.$emit('bv::show::modal', 'order-alert')
  }

  onPayPressed(stripePaymentElRef: any){
    stripePaymentElRef.submit();
  }

  async onTokenCreated(token: StripeCardToken){
    if(this.isShowLoading){
      return ;
    }
    this.isShowLoading = true;
    const charge =  {
      mid: this.order.shop_id.toString(),
      order_id: this.order.order_id.toString(),
      address: this.settings.getContact().addr,
      token: "",
    }
    this.payment.tokenCreated(token, this.order.order_total, charge)
    try{
      let response = await this.createCharge()
      if(response.status === 0){
        this.setAlertContent(response.error)
      }
      this.setAlertContent("Payment Success!")
      this.showAlertBox()
      this.isShowLoading = false;
    }catch (e) {
      this.setAlertContent(e)
      this.showAlertBox()
    }
    this.isShowLoading = false;
    this.refreshOrder();
  }

  refreshOrder(){
    this.fetchOrderDetail()
  }

  setAlertContent(s: string){
    this.alertContent = s;
  }

  async createCharge(){
    return this.payment.createCharge()
  }

  goToShopDetail(){
    this.$router.replace(
      {
        name: "ShopOrderView",
        params: {
          shopName:this.order.shop_name,
          shopId: this.order.shop_id.toString(),
        },
        query:{
          shopId: this.order.shop_id.toString()
        }
      })
  }



  onClickBackspace() {
    this.$router.push('orderList');
  }
}
</script>

<style scoped>

  @media screen and (max-width: 600px) {
    .order_detail_view {
      width: 100%;
    }

    .order_detail_view_wrap_with_log {
      flex-direction: column;
      justify-content: center;
    }

    .gray_border {
      border-top: 1px var(--border-color) solid;
    }

    .backspace_btn {
      margin-left: 20px;
    }

    .map_wrap > button {
      border: 1px var(--border-color) solid;
      width: 90%;
      border-radius:5px;
    }
  }

  @media screen and (min-width: 601px) and (max-width: 990px) {
    .order_detail_view {
      width: 95%;
    }

    .order_detail_view_wrap_with_log {
      flex-direction: column;
      justify-content: center;
    }

    .gray_border {
      border: 1px var(--border-color) solid;
      border-radius: 5px;
      margin-bottom: 25px;
    }

    .map_wrap > button {
      border: none;
      width: 100%;
      border-radius: 0 0 5px 5px;
      border-top: 1px var(--border-color) solid;
    }
  }

  @media screen and (min-width: 991px){
    .order_detail_view {
      width: 64rem;
    }

    .order_detail_view_wrap_with_log {
      justify-content: space-between;
    }

    .order_detail_left_wrap {
      flex: 100%;
      max-width: 100%;
    }

    .order_detail_right_wrap {
      flex: 0%;
      max-width: 0%;
    }

    .gray_border {
      border: 1px var(--border-color) solid;
      border-radius: 5px;
      margin-bottom: 25px;
    }

    .map_wrap > button {
      border: none;
      width: 100%;
      border-radius: 0 0 5px 5px;
      border-top: 1px var(--border-color) solid;
    }
  }

  .order_detail_view {
    margin: 100px auto 0 auto;
    display: flex;
    flex-direction: column;
  }

  .backspace_btn {
    align-self: start;
    background-color: white;
    padding: 5px 10px;
    border: 1px var(--border-color) solid;
    border-radius: 5px;
    margin-bottom: 25px;
  }

  .order_detail_view_wrap_with_log {
    display: flex;
  }

  .summary_wrap {
    padding: 20px;
    text-align: left;
  }

  .map_wrap > button {
    color: var(--theme-red);
    background-color: white;
    font-size: 14px;
    height: 45px;
  }

  .map {
    height: 200px;
  }

</style>
