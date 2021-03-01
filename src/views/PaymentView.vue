<template>
  <div>
    <div class="payment-container">
      <div class="order-info-container">
        <div class="cell-container" id="method-container">
          <div class="cell-title">{{$t('payment.method')}}</div>
          <div class="delivery-selection-cell">
            <div class="delivery-selection">
              <b-button value="delivery"
                        v-if="pickStatus !== 2"
                        id="delivery-button"
                        :class="deliveryButtonStyle"
                        @click="onDeliveryChange('delivery')">{{$t('payment.delivery')}}
              </b-button>
              <b-button value="pickup"
                        id="pickup-button"
                        :class="pickupButtonStyle"
                        :disabled="pickStatus === 0"
                        @click="onDeliveryChange('pickup')">{{$t('payment.pickup')}}
              </b-button>
            </div>
          </div>
        </div>
        <base-line/>
        <!--        <div class="cell-container" id="time-container">-->
        <!--          <div class="cell-title">{{$t('payment.time')}}</div>-->
        <!--          <div class="time-cell">-->
        <!--            <circle-check-box :des="$t('payment.arrive_around')" :index="0" @onChecked="onDeliveryTimeChecked"-->
        <!--                              :is-checked="timeOptions[0]"-->
        <!--            />-->
        <!--            <circle-check-box :des="$t('payment.asap')" :index="1" @onChecked="onDeliveryTimeChecked"-->
        <!--                              :is-checked="timeOptions[1]"/>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--        <base-line/>-->
        <div class="cell-container" id="address-container">
          <div class="cell-title">{{$t('payment.address')}}</div>
          <div class="address-cell">
            <div class="map-cell">
              <map-view
                :markers="mapMarkers"
                :zoom="15"
              ></map-view>
            </div>
            <div class="address-detail-cell">
              <div class="address-detail-cell-left">
                <div class="address-text" id="address">{{address}}</div>
                <div class="address-text" style="margin-top: 10px" id="phone">{{phone}}</div>
              </div>
              <div class="address-detail-cell-right">
                <b-button class="change-text" id="change-address-button" @click="onChangeAddress"
                >{{$t("payment.change")}}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <base-line/>
        <div class="cell-container" id="summary-container">
          <div class="cell-title">{{$t('payment.summary')}}</div>
          <div class="order-summary-cell">
            <payment-inner-cart :order-summary-title="shopName"
                                :gift="gift"
                                :product-list="products" @removeFromCart="removeProductFromCart"
            />
          </div>
        </div>
        <base-line/>

        <div class="cell-container">
          <div class="cell-title">{{$t('payment.note')}}</div>
          <label class="note_wrap">
            <textarea class="note_text" v-model="comment"></textarea>
          </label>
        </div>
        <base-line/>
      </div>
    </div>
    <PaymentSideBar :payment-info="paymentInfo"
                    @placeOrder="onPlaceOrder"
                    :order-name="this.cart.getShopDetail().name"
                    @tipsChange="onTipsChange"
                    @paymentTypeChange="onPaymentTypeChange"
                    @onTokenCreated="onTokenCreated"
                    @couponChange="onCouponChange"
                    @couponCancel="onCouponCancel"
                    :isCouponValidate="isCouponValidate"
                    :isCouponApplied="isCouponApplied"
                    :paymentTypes="paymentTypes"
                    :errorMessage="errorMessage"
                    @onShopNameClick="goBack"
                    @onCouponCancel="clearCoupon"
                    @paymentStatus="checkPaymentStatus($event)"/>

    <LightFooter class="footer"/>

    <MaskLoading :isShow="isShowLoading"/>

    <AlertModal id="payment-alert"
                :okOnly="true"
                :title="$t('common.alert')"
                :content="alertContent"
                v-on:onPressOK="$root.$emit('bv::hide::modal', 'payment-alert')"/>

  </div>


</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import LightFooter from "@/components/baseComponents/LightFooter.vue";
  import BaseLine from "@/components/baseComponents/BaseLine.vue";
  import PaymentSideBar from "@/components/payment/PaymentSideBar.vue";
  import CircleCheckBox from "@/components/baseComponents/CircleCheckBox.vue";
  import InnerCartBar from "@/components/cart/InnerCartBar.vue";
  import PaymentInnerCart from "@/components/cart/PaymentInnerCart.vue";
  import MapView from "@/components/payment/MapView.vue";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  import {PaymentLogicV1} from "@/logic/paymentLogic/PaymentLogicV1";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import {PaymentInfo, PlaceInfo} from "@/module/interface/PaymentInfo";
  import {PlaceOrderParams} from "@/module/interface/PlaceOrderParams";
  import {ShippingType} from "@/module/interface/ShippingType";
  import {PaymentTypeEnum} from "@/module/enum/PaymentTypeEnum";
  import {StripeCardToken} from "@/module/interface/StripeCardToken";
  import {GetCartParams} from '@/module/interface/GetCartParams';
  import {CartResponse, PaymentType} from "@/module/respones/CartResponse";
  import {Summary} from "@/module/interface/Summary";
  import {Product} from "@/module/Product";
  import {AppHelpers} from "@/common/AppHelpers";
  import {DeliveryType} from "@/module/enum/DeliveryType";
  import {CouponValidation, DiscountGroup} from "@/module/interface/Coupon";
  import {MapMarker} from "@/module/interface/MapMarker";
  import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
  import AlertModal from "@/components/baseComponents/AlertModal.vue";
  import {AddrBookLogic} from "@/logic/addrBookLogic/AddrBookLogic";
  import {ApiHelper} from "@/api/ApiHelper";
  import {Prop} from "vue/types/options";

  @Component({
    components: {
      MapView,
      PaymentInnerCart,
      InnerCartBar,
      CircleCheckBox,
      PaymentSideBar,
      BaseLine,
      LightFooter,
      MaskLoading,
      AlertModal
    }
  })
  export default class PaymentView extends Vue {
    private coupons = this.$route.query.coupons ?? "";
    private paymentInfo: PaymentInfo = new PaymentInfo();
    //@ts-ignore
    // private shopName = this.paymentInfo.shop_name;

    private settings: GlobalSettingPreference = GlobalSettingPreference.getInstance();
    private cart: SyncApiCart = SyncApiCart.getInstance()
    private payment: PaymentLogicV1 = PaymentLogicV1.getInstance();
    private order: PlaceOrderParams = this.payment.getOrder();
    private paymentTypes: PaymentType[] = []
    private shopInfo = this.cart.getShopDetail()
    private products: Product[] = this.cart.getCart();
    private shopName = this.shopInfo.name;
    private help = AppHelpers.getInstance();
    private gift = new Product();
    private isCouponValidate: boolean = true;
    private isCouponApplied: boolean = false;
    private comment: string = '';
    private isShowLoading = false
    private alertContent = '';


    //布局开关参数
    private isDelivery: boolean = this.cart.getDeliveryType() === DeliveryType.Delivery;
    private isPickUp: boolean = this.cart.getDeliveryType() === DeliveryType.Pickup;
    private deliveryButtonStyle: String = this.isDelivery ? 'delivery-selection-option-active'
      : 'delivery-selection-option'
    private pickupButtonStyle: String = this.isPickUp ? 'delivery-selection-option-active'
      : 'delivery-selection-option'
    private timeOptions: boolean[] = [false, false] //index 0 = 选择时间 index 1 = asap
    private paymentTypeSelected = false;
    private pickStatus = this.cart.checkEnablePickup()
    private address: string = this.isDelivery ? this.settings.getContact().addr : this.cart.getShopDetail().addr;
    private userPosition = this.isDelivery ? this.cart.getShopDetail().lat : this.settings.getUserLatLng()
    private phone: string = this.isDelivery ? this.settings.getContact().tel.toString() : this.cart.getShopDetail().tel

    private mapMarkers: MapMarker[] = this.isDelivery ? [
      new MapMarker(
        this.settings.getUserLatLng().lat,
        this.settings.getUserLatLng().lng
      )
    ] : [new MapMarker(
      this.cart.getShopDetail().lat,
      this.cart.getShopDetail().lon
    ),]
    private errorMessage = ""

    @Watch('cart', {deep: true}) watchCart(value: SyncApiCart) {
      this.initGift(value.getShopFullAmountGifts())
      if (this.cart.getCartCounter()) {
        return;
      }
      this.goBack()

    }


    mounted() {
      this.settings.getUserLatLng().lat
      this.settings.getUserLatLng().lng
      //将页面重置到顶部
      window.scrollTo(0, 0);
      this.isShowLoading = true
      //@ts-ignore
      this.getCloudCart(this.coupons, this.coupons ? 0 : 1)
      this.initGift(this.cart.getShopFullAmountGifts())

    }

    initGift(name: string) {
      if (!name) {
        this.gift = new Product();
        return
      }
      this.gift.product_name = this.$t('cart.gift') + " " + name;
      this.gift.qty = -1;
    }

    checkPaymentStatus(paymentTypeChecks: boolean[]) {
      this.alertContent = this.$t('payment.payment_alert').toString()
      this.showAlertBox(!paymentTypeChecks[0] && !paymentTypeChecks[1]);
    }

    showAlertBox(isShow: boolean) {
      if (!isShow) {
        return
      }
      this.$root.$emit('bv::show::modal', 'payment-alert')
    }

    setPaymentInfo(data: CartResponse) {
      let s = data.summary
      let d = data.delivery
      let p = data.place
      let discountG = DiscountGroup.iniDiscount(data.discount);
      let id = data.cart_id;
      this.paymentInfo.subtotal = s.subtotal;
      this.paymentInfo.org_subtotal = s.org_subtotal;
      this.paymentInfo.grand_total = s.grand_total;
      this.paymentInfo.taxFee = s.tax;
      this.paymentInfo.discount = s.discount;
      this.paymentInfo.shippingInfo = d
      this.paymentInfo.discountGroup = discountG
      this.paymentInfo.serviceFeeDesc = s.service_fee_desc
      this.paymentInfo.serviceFee = s.service_fee
      this.paymentInfo.tips = this.payment.calTips(this.isDelivery ? 15 : 0, s.org_subtotal + s.shipping_fee);
      this.paymentInfo.deliveryType = this.cart.getDeliveryType();
      /* By Ln 2021-1-1 弃用
      this.paymentInfo.total = this.help
        .roundTowDecimalNumber(s.grand_total +  this.paymentInfo.tips + this.paymentInfo.paymentFee + this.paymentInfo.serviceFee);
      */
      this.paymentInfo.totalWithoutTips = this.help
        .roundTowDecimalNumber(s.grand_total + this.paymentInfo.paymentFee);
      this.paymentInfo.placeInfo = p;
      this.paymentInfo.cart_id = id;
      let gift = data.summary.product_gift ? data.summary.product_gift : ''
      this.cart.setShopFullAmountGifts(gift);
      this.cart.setCouponCode(data.place.codes ? data.place.codes : "");


    }


    setDeliveryType(type: string) {
      this.paymentInfo.deliveryType = type;
    }


    async getCloudCart(promoCode?: string, auto_match?: number) {
      try {
        let cartInfo = new GetCartParams()
        cartInfo.auto_match = auto_match ? 1 : 0;
        cartInfo.shipping_type = this.cart.getDeliveryType();
        cartInfo.address = this.address
        cartInfo.promo_codes = promoCode ? promoCode : this.cart.getCouponCode()
        const rs = await this.cart.fetchCart(cartInfo)
        let h = AppHelpers.getInstance()
        if (!h.isLogin(rs)) {
          h.goToLogin(this)
          return;
        }
        const data: CartResponse = rs.data
        this.paymentTypes = this.payment.sortPaymentFee(data.payment_types)
        this.setPaymentInfo(data)
        this.isShowLoading = false
        this.isDelivery ? this.setCusMarker() : this.setShopMarker();
      } catch (e) {
        console.log(e)
      }
    }


    onDeliveryOptionChanged() {
      this.paymentInfo.tips = this.payment.calTips(this.isDelivery ? 15 : 0, this.paymentInfo.org_subtotal
        + parseFloat(this.paymentInfo.shippingInfo.shipping_fee))
      this.deliveryButtonStyle = this.isDelivery ? 'delivery-selection-option-active' : 'delivery-selection-option';
      this.pickupButtonStyle = this.isPickUp ? 'delivery-selection-option-active' : 'delivery-selection-option';
      this.getCloudCart("", 1);
    }

    async onDeliveryChange(option: string) {
      this.cart.setDeliveryType(option)
      switch (option) {
        case ShippingType.DELIVERY:
          this.isDelivery = true;
          this.isPickUp = !this.isDelivery;
          this.setDeliveryType(option);
          this.setCusAddressInfo();
          break;
        case ShippingType.PICKUP:
          this.isPickUp = true;
          this.isDelivery = !this.isPickUp;
          this.setDeliveryType(option);
          this.setShopAddressInfo();
          break;
        default:
          this.isDelivery = true;
          this.isPickUp = !this.isDelivery;
          this.setDeliveryType(option);
          this.setCusAddressInfo();
          break;
      }
      this.onDeliveryOptionChanged();


    }

    setShopAddressInfo() {
      this.address = this.cart.getShopDetail().addr
      this.phone = this.cart.getShopDetail().tel

    }

    setCusAddressInfo() {
      this.address = this.settings.getContact().addr;
      this.phone = this.settings.getContact().tel;
    }

    setShopMarker() {
      this, this.mapMarkers = [new MapMarker(
        this.cart.getShopDetail().lat,
        this.cart.getShopDetail().lon
      ),]
    }

    setCusMarker() {
      if (!this.paymentInfo.shippingInfo && !this.paymentInfo.shippingInfo[0]) {
        return;
      }
      this.mapMarkers = [
        new MapMarker(
          this.paymentInfo.shippingInfo.customer_latlng.lat,
          this.paymentInfo.shippingInfo.customer_latlng.lng,
        )
      ]
    }

    onDeliveryTimeChecked(index: any) {
      this.timeOptions = this.timeOptions.map(o => o = false)
      this.timeOptions[index] = true;
    }

    /*
     * 提交stripe
     */
    async onPlaceOrder(stripePaymentElRef: any) {
      if (!this.enablePlaceOrder()) {
        this.alertContent = this.paymentInfo.placeInfo.error
        this.showAlertBox(true);
        return
      }
      if (this.order.payment_type === PaymentTypeEnum.OnlinePay) {
        stripePaymentElRef.submit();
      } else {
        const info = await this.placeOrder();
        this.isShowLoading = false;
        const order_id = info.order_id
        if (!this.onReceiveResponseValid(info)) {
          let h = AppHelpers.getInstance()
          if (!h.isLogin(info)) {
            h.goToLogin(this)
            return
          }
          this.goToPaymentFail(order_id, info.error);
        }
        this.goToPaymentSuccess(order_id)

      }
    }

    onReceiveResponseValid(info: any) {
      const status = info.status
      return status === 1
    }


    async onTokenCreated(token: StripeCardToken) {
      const info = await this.placeOrder();
      if (!this.onReceiveResponseValid(info)) {
        let h = AppHelpers.getInstance()
        if (!h.isLogin(info)) {
          h.goToLogin(this)
          return
        }
        this.alertContent = info.error
        this.showAlertBox(true)

        this.goToPaymentFail(info.order_id, info.error)
        return;
      }
      const charge = {
        mid: this.cart.getShopId().toString(),
        order_id: info.order_id.toString(),
        address: this.settings.getContact().addr,
        token: "",
      }
      this.payment.tokenCreated(token, this.paymentInfo.total, charge)
      try {
        let response = await this.createCharge()
        if (response.status === 0) {
          this.goToPaymentFail(info.order_id, info.error)
          this.isShowLoading = false;
          return;
        }
        this.goToPaymentSuccess(info.order_id)
      } catch (e) {
        console.log(e)
        this.goToPaymentFail(0, e)
      }
      this.isShowLoading = false;

    }

    /**
     * 下单
     * @param token
     */
    async placeOrder() {
      this.isShowLoading = true
      this.initOrderParams()
      try {
        const response = await this.payment.placeOrder();
        const status = response.status;
        const order_id = response.data.order_id;
        const error = response.error;

        return {
          "status": status,
          "order_id": order_id,
          "error": error ? error : ''
        }
      } catch (e) {
        return {
          "status": 0,
          "order_id": 0,
          "error": e.toString()
        }
      }

    }

    goToPaymentFail(orderId: number, error: string) {
      this.$router.replace({
        path: 'PaymentFail',
        query: {
          orderId: orderId.toString(),
          error: error,
        }
      });
    }

    goToPaymentSuccess(orderId: number) {
      this.cart.clearCart();
      this.$router.replace({
        path: 'PaymentSuccess',
        query: {
          orderId: orderId.toString()
        }
      });
    }

    initOrderParams() {
      //默认配送
      this.order.shop_id = this.cart.getShopId();
      this.order.tips_amount = this.paymentInfo.tips;
      this.order.tax_fee = this.paymentInfo.taxFee;
      this.order.subtotal = this.paymentInfo.placeInfo.check_price;
      this.order.promotion_code = this.paymentInfo.placeInfo.codes;
      this.order.shipping_distance = this.paymentInfo.shippingInfo.distance;
      this.order.shipping_fee = parseInt(this.paymentInfo.shippingInfo.shipping_fee);
      this.order.shipping_type = this.paymentInfo.deliveryType
      this.order.items = JSON.stringify(SyncApiCart.getInstance().getCart());
      this.order.contact = JSON.stringify(this.settings.getContact());
      this.order.comment = this.comment;
      this.order.cart_id = this.paymentInfo.cart_id;
    }

    /**
     * 创建charge
     */
    async createCharge() {
      return this.payment.createCharge()
    }


    setPaymentFee(type: string) {
      let a = this.paymentTypes.filter(p => p.payment_type === type)
      this.paymentInfo.paymentFee = a[0].payment_fee;
    }

    enablePlaceOrder(): boolean {
      return this.paymentTypeSelected && this.paymentInfo.placeInfo.status === 1 && !this.isShowLoading
    }


    onPaymentTypeChange(type: string) {
      this.paymentTypeSelected = true
      this.setPaymentFee(type);
      this.order.payment_type = type
    }

    isTipsPercent(tipsPercent: number): boolean {
      var percent = [10, 15, 20];
      return percent.includes(tipsPercent)
    }

    onTipsChange(tipsObj: object) {
      //@ts-ignore
      const tipsPercent = tipsObj.tipsPer
      //@ts-ignore
      const tipsAmount = tipsObj.tipsAmount
      this.paymentInfo.tips = tipsPercent ? this.calTips(tipsPercent, this.paymentInfo.org_subtotal + parseFloat(this.paymentInfo.shippingInfo.shipping_fee))
        : tipsAmount;
      // By Ln 2021-1-1 弃用
      // this.paymentInfo.total = this.help.roundTowDecimalNumber(this.paymentInfo.totalWithoutTips + this.paymentInfo.tips);
    }

    calTips(tipsPercent: number, subtotal: number): number {
      return this.payment.calTips(tipsPercent, subtotal)
    }

    onChangeAddress() {
      AddrBookLogic.getInstance().setEnableSelect(1)
      this.$router.push(
        {
          name: 'AddrBook',
          query: {
            enableSelect: "1"
          },
        })
    }

    removeProductFromCart(p: Product) {
      if (!this.cart) {
        return;
      }
      this.cart.removeProductFromCart(p);
      this.products = this.cart.getCart();
      if (this.cart.getCartCounter() > 0) {
        //如果清空了本地购物车，不调取远端购物车
        this.getCloudCart();
      }
    }

    onCouponCancel() {
      this.errorMessage = ""
    }

    onCouponChange() {
      // this.errorMessage = ""
      // // this.couponCode = couponCode;
      // let response = await this.validateCouponCode(couponCode);
      // this.isCouponValidate = response.status > 0;
      // if (this.isCouponValidate) {
      //   this.onCouponApplied(couponCode);
      // }
      this.goToCouponList()
    }

    // onCouponApplied(couponCode: string) {
    //   this.$bvModal.hide("add-coupon");
    //   this.isCouponApplied = true;
    //   this.getCloudCart(couponCode);
    // }
    //
    // async validateCouponCode(code: string) {
    //   try {
    //     let response = await this.cart.validateCoupon(code);
    //     this.errorMessage = response.error ? response.error : ""
    //     return response
    //   } catch (e) {
    //     console.log(e)
    //     return ApiHelper.getInstance().getErrorMessage(e);
    //   }
    //
    // }

    goBack() {
      this.$router.go(-1);
    }

    goToCouponList() {
      this.$router.push(
        {
          name: 'CouponListView',
          query: {
            enableSelect: "1",
          },
        })
    }

    clearCoupon() {
      this.isCouponApplied = false
      this.cart.setCouponCode('')
      this.getCloudCart("", 1);
    }


  }
</script>

<style scoped>

  @media screen and (max-width: 800px) {
    .payment-container {
    }

    .order-info-container {
      padding: 0 20px;
      width: 100%;
    }

    .cell-container {
      flex-direction: column;
    }

    .cell-title {
      margin-bottom: 20px;
    }
  }

  @media screen and (min-width: 801px) and (max-width: 1100px) {
    .payment-container {
      justify-content: flex-end;
      padding-right: 100px;
    }

    .order-info-container {
      margin-right: 310px;
      width: 60%;
    }

    .address-cell {
      width: 10%;
    }
  }

  @media screen and (min-width: 1101px) {
    .payment-container {
      justify-content: center;
      padding-right: 200px;
    }

    .order-info-container {
      width: 45%;
    }

    .address-cell {
      width: 10%;
    }
  }

  .payment-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 60px;
  }

  .order-info-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  .cell-container {
    display: flex;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .cell-title {
    font-size: 24px;
    font-weight: bold;
    color: var(--dark-black);
    flex: 25%;
    text-align: start;

  }

  .delivery-selection-cell {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex: 75%;
  }

  .delivery-selection {
    display: flex;
    flex-direction: row;
    border-radius: 25px;
    border: 1px solid #E6E6E6;
  }

  .delivery-selection-option-active {
    display: flex;
    flex-direction: row;
    border-radius: 25px;
    background-color: var(--theme-red);
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    color: white;
    font-weight: bold;
    font-size: 14px;
    align-items: center;
    border: 0;
    outline: none;
  }

  .delivery-selection-option {
    display: flex;
    flex-direction: row;
    border-radius: 25px;
    background-color: white;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    color: var(--dark-black);
    font-weight: bold;
    font-size: 14px;
    border: 0;
    outline: none;
  }


  /*去掉button 点击效果*/

  #pickup-button.btn:focus, #delivery-button.btn:focus {
    outline: 0;
    box-shadow: none !important;
    background-color: var(--theme-red);
    color: white;
    font-weight: bold;
    font-size: 14px;
    margin-top: -1px;
    margin-bottom: -1px;
    align-items: center;
  }

  .time-cell {
    padding-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 75%;
  }

  /*input[type=checkbox] {*/
  /*  visibility: hidden;*/
  /*}*/


  /*#color-input-red + label {*/
  /*  width: 24px;*/
  /*  height: 24px;*/
  /*  background: white;*/
  /*  margin-top: 4px;*/
  /*  margin-left: -10px;*/
  /*  border-radius: 50px;*/
  /*  border: 0.5px solid var(--light-gray);*/
  /*}*/

  /*#color-input-red:checked + label::before {*/
  /*  display: block;*/
  /*  content: "\2713";*/
  /*  text-align: center;*/
  /*  font-size: 16px;*/
  /*  color: white;*/
  /*  background: var(--theme-red);*/
  /*  border-radius: 50px;*/
  /*}*/

  .address-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 75%;
  }

  .map-cell {
    flex: 75%;
    width: 100%;
    height: 160px;

  }

  .address-cell {
    display: flex;
    flex-direction: column;
  }

  .address-detail-cell {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .address-detail-cell-left {;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .address-detail-cell-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .address-text {
    color: var(--dark-black);
    font-size: 16px;
    text-align: left;
  }

  .change-text {
    font-size: 14px;
    color: var(--theme-red);
    outline: 0;
    border: 0;
    padding-right: 0;
    background-color: white;
  }

  .add-text {
    margin-top: 10px;
    font-size: 14px;
    color: var(--theme-red);
    outline: 0;
    border: 0;
    padding-left: 0;
    background-color: white;
  }

  #change-address-button.btn:focus, #add-address-button.btn:focus {
    outline: 0;
    box-shadow: none !important;
    background-color: white;
  }

  .order-summary-cell {
    display: flex;
    flex-direction: column;
    flex: 75%;
    margin-right: -15px;
  }

  .footer {
    margin-top: 100px;
  }

  .note_wrap {
    flex: 75%;
  }

  .note_text {
    width: 100%;
    height: 100px;
    background-color: #FCFCFC;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    outline: 0;
    padding: 10px;
    align-items: flex-start;
    justify-content: flex-start;
  }

</style>
