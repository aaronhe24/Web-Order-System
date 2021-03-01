<template>
  <div class="detail-container">
    <header>
      <h3   class="title">{{$t('payment.sidebar_title')}}</h3>
      <div style="display: flex;justify-content: flex-start;">
        <img src="@/assets/payment/icon_shop@2x.png"
             style="width: 18px; height: 18px; margin-top: 2px">
        <button @click="onShopNameClick" class="shop-name">{{orderName}}</button>
      </div>
    </header>
    <base-line style="margin-top: 20px"/>
    <PaymentDetailCell :payment-info="payinfo"/>
    <base-line style="margin-top: 20px"/>

    <div class="tips-cell" v-if="isShowTips">
      <div class="detail-member-cell" v-if="tips !== ''">
        <div class="detail-text">{{$t('payment.tips')}}</div>
        <div class="detail-text">{{tips}}</div>
      </div>
      <div class="tips-selection-cell">
        <div class="tips-selection">
          <b-button value="10"
                    :class="tips10ButtonStyle"
                    @click="onTipChange('10')">10%
          </b-button>
          <b-button value="15"
                    :class="tips15ButtonStyle"
                    @click="onTipChange('15')">15%
          </b-button>
          <b-button value="20"
                    :class="tips20ButtonStyle"
                    @click="onTipChange('20')">20%
          </b-button>
        </div>
        <b-button value="edit"
                  :class="tipsEditButtonStyle"
                  @click="onTipChange('edit')">{{$t('payment.edit')}}
        </b-button>
      </div>
    </div>
    <base-line style="margin-top: 20px" v-if="isShowTips"/>

    <div class="detail-member-cell" v-if="total !== ''">
      <div class="detail-text" style="font-weight: bolder;font-size: 16px">{{$t('payment.total')}}</div>
      <div class="detail-text" style="font-weight: bolder;font-size: 16px">{{total}}</div>
    </div>
    <base-line style="margin-top: 20px"/>

    <div class="coupon-list">
      <div class="detail-text" style="text-align: start">
        {{$t('payment.coupons')}}
      </div>
      <div id="internal-discount"
           v-for="(discount, index) in discountGroup.internal_discount"
           v-if="discountGroup.hasInternalDiscount()">
        <PaymentCouponCell :discount="discount" v-if="discount.valid"/>
      </div>
      <div id="normal_discount"
           v-for="(discount, index) in discountGroup.normal_discount"
           v-if="discountGroup.hasNormalDiscount()">
        <PaymentCouponCell :discount="discount" v-if="discount.valid"/>
      </div>
      <div id="member_discount"
           v-for="(discount, index) in discountGroup.member_discount"
           v-if="discountGroup.hasMemberDiscount()">
        <PaymentCouponCell :discount="discount" v-if="discount.valid"/>
      </div>
      <div id="overlap_discount"
           v-for="(discount, index) in discountGroup.overlap_discount"
           v-if="discountGroup.hasOverLapDiscount()">
        <PaymentCouponCell :discount="discount" v-if="discount.valid"/>
      </div>
    </div>
    <base-line style="margin-top: 20px"/>
    <div class="coupon_wrap">
      <button @click="onAddCouponCLick" class="add_coupon_btn">
        {{$t('payment.add_coupon')}}
      </button>
    </div>

    <base-line style="margin-top: 20px"/>

    <div class="payment-option-container">
      <div class="detail-text">{{$t('payment.payment_option')}}</div>
      <label class="payment-option-cell" v-if="supportOnlinePay" for="online-pay-checkbox">
        <b-button id="online-pay-checkbox" class="qty-button"
                  @click="onPaymentTypeChanged(0)"
        >
          <img v-if="paymentTypeChecks[0]" src="../../assets/product/icon_radio.png" alt="">
          <img v-if="!paymentTypeChecks[0]" src="../../assets/product/icon_radio_gray.png" alt="">
        </b-button>
        <img src="@/assets/payment/icon_credit_card@2x.png"
             style="margin-left: 10px;width: 16px; height: 16px;justify-self: center">
        <div style="margin-left: 10px;font-size: 14px">{{$t('payment.credit_card')}}</div>
      </label>
      <label class="payment-option-cell" v-if="supportCashPay">
        <b-button id="cash-pay-checkbox" class="qty-button"
                  @click="onPaymentTypeChanged(1)"
        >
          <img v-if="paymentTypeChecks[1]" src="../../assets/product/icon_radio.png" alt="">
          <img v-if="!paymentTypeChecks[1]" src="../../assets/product/icon_radio_gray.png" alt="">
        </b-button>
        <img src="@/assets/payment/cashpay_icon@2x.png"
             style="margin-left: 10px;width: 16px; height: 16px;justify-self: center">
        <div style="margin-left: 10px;font-size: 14px">{{$t('payment.cash')}}</div>
      </label>

    </div>
    <base-line style="margin-top: 20px"/>


    <PaymentCard v-if="isShowStripPayment" style="margin-top: 20px"
                 :amount="paymentInfo.total"
                 @sendElRef="setPaymentElRef"
                 @onTokenCreated="onTokenCreated"
    />


    <b-button class="submit-button" @click="submit">
      {{$t('payment.place_order')}}
    </b-button>
    <b-modal id="tips-edit" modal-class="my-modal" hide-footer
             hide-header>
      <tips-edit-cell @onConfirm="onTipsConfirm" @onCancel="onTipsCancel"/>
    </b-modal>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import PaymentDetailCell from "@/components/payment/PaymentDetailCell.vue";
  import PaymentCard from "@/components/baseComponents/PaymentCard.vue";
  import BaseLine from "@/components/baseComponents/BaseLine.vue";
  import CircleCheckBox from "@/components/baseComponents/CircleCheckBox.vue";
  import {PaymentInfo} from "@/module/interface/PaymentInfo";
  import {PaymentTypeEnum} from "@/module/enum/PaymentTypeEnum";
  import TipsEditCell from "@/components/payment/TipsEditCell.vue";
  import {StripeCardToken} from "@/module/interface/StripeCardToken";
  import AddCouponCell from "@/components/payment/AddCouponCell.vue";
  import {CouponValidation, CouponValidationProduct} from "@/module/interface/Coupon";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import {PaymentType} from "@/module/respones/CartResponse";
  import {DeliveryType} from "@/module/enum/DeliveryType";
  import PaymentCouponCell from "@/components/payment/PaymentCouponCell.vue";

  @Component({
    components: {
      PaymentCouponCell,
      AddCouponCell, TipsEditCell, CircleCheckBox, PaymentDetailCell, BaseLine, PaymentCard}
  })
  export default class PaymentSideBar extends Vue {
    @Prop() private paymentInfo!: PaymentInfo
    @Prop() private orderName!: string
    @Prop() private isCouponApplied!: boolean;
    @Prop() private paymentTypes!: PaymentType[];
    @Prop() private errorMessage!: string;
    private discountGroup = this.paymentInfo.discountGroup;
    private supportOnlinePay = this.includesPaymentType(PaymentTypeEnum.OnlinePay);
    private supportCashPay = this.includesPaymentType(PaymentTypeEnum.Cash)
    private payinfo = this.paymentInfo;
    private selectedTips: number = 15;
    private tips: string = ''
    private total: string = ''

    private isTips15: boolean = true;
    private isTips10: boolean = false;
    private isTips20: boolean = false;
    private isEdit: boolean = false;
    private tips20ButtonStyle: string = "tips-selection-option";
    private tips10ButtonStyle: string = 'tips-selection-option'
    private tips15ButtonStyle: string = "tips-selection-option-active";
    private tipsEditButtonStyle: string = 'tips-edit';
    private stripePaymentElRef!: any;
    private isShowStripPayment: boolean = false
    private isShowModal: boolean = false
    private paymentTypeChecks: boolean[] = [false, false]
    private isShowTips = this.paymentInfo.deliveryType === DeliveryType.Delivery


    @Watch("errorMessage")watchErroMessage(newValue: string){
      this.errorMessage = newValue
    }



    mounted() {

    }

    @Watch('paymentInfo', {deep: true}) watchPaymentInfo(newValue: PaymentInfo, oldValue: PaymentInfo) {
      this.paymentInfo = newValue
      this.total = "$" + this.paymentInfo.total.toString()
      this.tips = "$" + this.paymentInfo.tips.toString()
      this.discountGroup = this.paymentInfo.discountGroup;
      this.isShowTips = this.paymentInfo.deliveryType === DeliveryType.Delivery
      this.isShowTips ? null : this.setTipsAsDef()
    }

    @Watch("paymentTypes") watchPaymentType(value: PaymentType[]) {
      this.paymentTypes = value
      this.supportOnlinePay = this.includesPaymentType(PaymentTypeEnum.OnlinePay);
      this.supportCashPay = this.includesPaymentType(PaymentTypeEnum.Cash)
    }

    setTipsAsDef(){
      this.isTips10 = false;
      this.isTips15 = true;
      this.isTips20 = false;
      this.isEdit = false;
      this.selectedTips = 15;
      this.onTipsStyleChange()
    }


    includesPaymentType(type: string) {
      let a = this.paymentTypes.filter(p => p.payment_type === type);
      return a.length === 1;
    }


    setPaymentElRef(ref: any) {
      this.stripePaymentElRef = ref
    }

    onTipsStyleChange() {
      this.tips20ButtonStyle = this.isTips20 ? 'tips-selection-option-active' : 'tips-selection-option';
      this.tips10ButtonStyle = this.isTips10 ? 'tips-selection-option-active' : 'tips-selection-option';
      this.tips15ButtonStyle = this.isTips15 ? 'tips-selection-option-active' : 'tips-selection-option';
      this.tipsEditButtonStyle = this.isEdit ? 'tips-edit-active' : 'tips-edit';
    }

    submit() {
      // this.stripePaymentElRef.submit();
      this.$emit("placeOrder", this.stripePaymentElRef)
      this.$emit("paymentStatus", this.paymentTypeChecks)

    }

    onPaymentTypeChanged(index: number) {
      this.paymentTypeChecks = this.paymentTypeChecks.map(p => false)
      this.paymentTypeChecks[index] = true;
      this.isShowStripPayment = this.paymentTypeChecks[0];
      let type = ''
      switch (index) {
        case 0:
          type = PaymentTypeEnum.OnlinePay
          break;
        case 1:
          type = PaymentTypeEnum.Cash
          break
        default:
          0
          type = PaymentTypeEnum.OnlinePay
          break;
      }
      this.$emit("paymentTypeChange", type)
    }


    onTipChange(tipsLabel: string) {
      switch (tipsLabel) {
        case "10":
          this.isTips10 = true;
          this.isTips15 = false;
          this.isTips20 = false;
          this.isEdit = false;
          this.onTipsStyleChange()
          this.selectedTips = 10;
          break;
        case "15":
          this.isTips10 = false;
          this.isTips15 = true;
          this.isTips20 = false;
          this.isEdit = false;
          this.selectedTips = 15;
          this.onTipsStyleChange()
          break;
        case "20":
          this.isTips10 = false;
          this.isTips15 = false;
          this.isTips20 = true;
          this.isEdit = false;
          this.selectedTips = 20;
          this.onTipsStyleChange()
          break;
        case "edit":
          this.isTips10 = false;
          this.isTips15 = false;
          this.isTips20 = false;
          this.isEdit = true;
          this.onTipsStyleChange()
          this.onTipsEditClick();
          break;
        default:
          this.isTips10 = false;
          this.isTips15 = true;
          this.isTips20 = false;
          this.isEdit = false;
          this.selectedTips = 15;
          this.onTipsStyleChange()
          break;
      }
      if(tipsLabel === "emit"){
        return
      }
      const obj={
        tipsAmount: 0,
        tipsPer: this.selectedTips,
      }
      this.$emit("tipsChange", obj)
    }

    onTipsEditClick() {
      this.$bvModal.show("tips-edit")
    }

    onAddCouponCLick() {
      // this.isCouponValidate = true;
      // this.$bvModal.show("add-coupon");
      this.$emit('couponChange');
    }

    onTokenCreated(token: StripeCardToken) {
      this.$emit('onTokenCreated', token)
    }


    onTipsCancel() {
      this.$bvModal.hide("tips-edit")
      this.onTipChange("15")
    }

    onTipsConfirm(tips: string) {
      this.$bvModal.hide("tips-edit")
      this.selectedTips = parseFloat(tips)
      const obj={
        tipsAmount: this.selectedTips,
        tipsPer: 0,
      }
      this.$emit("tipsChange", obj)
    }


    onShopNameClick(){
      this.$emit('onShopNameClick');
    }

    onCouponCancel(){
      this.$emit('onCouponCancel')
    }
  }

</script>

<style scoped>

  @media screen and (max-width: 800px) {
    /deep/ .my-modal > .modal-dialog {
      border-radius: 4px;
      position: fixed;
      top: 250px;
      left: 50px;
      right: 50px;
    }
  }

  @media screen and (min-width: 801px) and (max-width: 990px) {
    .detail-container {
      position: fixed;
      height: 100%;
      width: 24%;
      min-width: 400px;
      right: 0;
      top: 80px;
      border-left: 1px solid var(--border-color);
      border-top: 1px solid var(--border-color);
      margin-top: -1px;
    }

    /deep/ .my-modal > .modal-dialog {
      border-radius: 4px;
      position: fixed;
      top: 250px;
      left: 50px;
      right: 50px;
    }
  }

  @media screen and (min-width: 991px) {
    .detail-container {
      position: fixed;
      height: 100%;
      width: 24%;
      min-width: 400px;
      right: 0;
      top: 80px;
      border-left: 1px solid var(--border-color);
      border-top: 1px solid var(--border-color);
      margin-top: -1px;
    }

    /deep/ .my-modal > .modal-dialog {
      width: 280px;
      /*padding: 0;*/
      /*margin: 0;*/
      top: 300px;
      border-radius: 4px;
      /*box-shadow: black;*/
    }
  }


  .detail-container {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding-right: 15px;
    padding-left: 15px;
    overflow-y: auto;
    padding-bottom: 50px;
  }


  .shop-name {
    text-align: start;
    font-weight: bold;
    outline: 0;
    color: var(--theme-red);
    border: 0;
    background-color: white;
  }

  .title {
    text-align: start;
    font-weight: bold;
    margin-top: 20px;
  }


  .payment-option-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .payment-option-cell {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    align-items: center;
    margin-top: 15px;
  }

  .detail-member-cell {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
  }


  .detail-inner {
    display: flex;
    flex-direction: column;
  }

  .tips-cell {
    display: flex;;
    flex-direction: column;
  }

  .detail-text {
    color: var(--dark-black);
    font-size: 14px;
  }

  .tips-selection-cell {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .tips-selection {
    display: flex;
    flex-direction: row;
    border-radius: 25px;
    border: 1px solid #E6E6E6;

  }

  .tips-selection-option-active {
    display: flex;
    flex-direction: row;
    border-radius: 25px;
    background-color: var(--theme-red);
    padding: 8px 20px;
    color: white;
    font-weight: bold;
    font-size: 14px;
    margin-top: -1px;
    margin-bottom: -1px;
    align-items: center;
    border: 0;
    outline: none;
  }

  .tips-selection-option {
    display: flex;
    flex-direction: row;
    border-radius: 25px;
    background-color: white;
    padding: 8px 20px;
    color: var(--dark-black);
    font-weight: bold;
    font-size: 14px;
    border: 0;
    outline: none;
  }

  .tips-edit {
    border-radius: 25px;
    border: 1px solid #E6E6E6;
    width: 90px;
    background-color: white;
    padding: 8px 20px;
    font-weight: bold;
    font-size: 14px;
    color: var(--gray);
    outline: none;
  }

  .tips-edit-active {
    border-radius: 25px;
    border: 0;
    width: 90px;
    background-color: var(--theme-red);
    padding: 8px 20px;
    font-weight: bold;
    font-size: 14px;
    color: white;
    outline: none;
  }

  .submit-button {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    background-color: var(--theme-red);
    border-width: 0;
    width: 100%;
    padding: 10px;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 50px;
  }

  /*去掉button 点击效果*/
  .btn:focus {
    outline: 0;
    box-shadow: none !important;
    /*background-color: var(--theme-red);*/
    /*color: white;*/
    /*font-weight: bold;*/
    /*font-size: 14px;*/
    /*margin-top: -1px;*/
    /*margin-bottom: -1px;*/
    /*align-items: center;*/
  }


  input[type=checkbox] {
    visibility: hidden;
  }


  #online-pay-checkbox + label {
    width: 24px;
    height: 24px;
    background: white;
    margin-top: 4px;
    margin-left: -10px;
    border-radius: 50px;
    border: 0.5px solid var(--light-gray);
  }

  #online-pay-checkbox:checked + label::before {
    display: block;
    content: "\2713";
    text-align: center;
    font-size: 16px;
    color: white;
    background: var(--theme-red);
    border-radius: 50px;
  }

  #cash-pay-checkbox + label {
    width: 24px;
    height: 24px;
    background: white;
    margin-top: 4px;
    margin-left: -10px;
    border-radius: 50px;
    border: 0.5px solid var(--light-gray);
  }

  #cash-pay-checkbox:checked + label::before {
    display: block;
    content: "\2713";
    text-align: center;
    font-size: 16px;
    color: white;
    background: var(--theme-red);
    border-radius: 50px;
  }

  .coupon_wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }

  .add_coupon_btn {
    align-self: flex-start;
    color: var(--theme-red);
    border: none;
    background-color: white;
    padding: 0;
  }

  .coupon_success_txt {
    text-align: left;
    margin: 20px 0;
  }

  .coupon_list > ul {
    margin: 0;
    padding: 0 10px;
  }

  .qty-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    flex-direction: row;
    color: white;
    border: 0;
    width: 24px;
    height: 24px;
    padding: 0px;
    font-size: 15px;
  }

  .coupon-list{
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
</style>
