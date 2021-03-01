<template>
  <div class="addr_book_view">
    <div class="left-blank"/>
    <div class="main-section">
      <div class="addr_book_container coupon_header">
        <h4 class="title p-3">{{$t('common.my_coupon')}}</h4>
        <div v-if="(enableSelect !== 0)" class="coupon_input_wrap m-3" :class="isCouponValidate?'':'input-text-error'">
          <label>
            <input placeholder="code" v-model="typeInCouponCode">
          </label>
          <button @click="onAddCouponConfirm(typeInCouponCode)">OK</button>
        </div>
      </div>
      <div v-if="enableSelect !== 0" class="addr_book_container btn_wrap">
        <button @click="applyCoupons">{{$t('coupon.apply_coupon')}}</button>
      </div>
      <div v-for="(coupons, idx) in couponList" :key="idx" v-if="!(coupons.coupons.length === 0)"
           style="margin-top: 30px">
        <div class="title-container">
          <img :src="getGroupImg(coupons.discount_group)" alt="" style="width:24px;height:24px">
          <h4 class="title">{{coupons.desc}}</h4>
        </div>
        <div class="addr_book_wrap addr_book_container">
          <coupon-cell v-for="(coupon, idx) in coupons.coupons"
                       :key="idx"
                       :coupon="coupon"
                       :highlightLookup="highlightLookup"
                       :clickable="(enableSelect !== 0)"
                       @onClickCoupon="selectCoupon"
          ></coupon-cell>
        </div>
      </div>
      <alert-modal id="coupon-err"
                   :ok-only="true"
                   :title="'Failed to apply coupon'"
                   :content="alertContent"
                   v-on:onPressOK="$root.$emit('bv::hide::modal', 'coupon-err')"/>
    </div>
    <div class="left-blank"/>
    <MaskLoading :isShow="isShowLoading"/>

    <div class="to-top-container" v-if="isShowTopBtn">
      <img src="../assets/icon_top.png" alt="" style="width: 100%; cursor: pointer" @click="backToTop">
    </div>
  </div>

</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  import {CouponListLogic} from "@/logic/couponListLogic/CouponListLogic";
  import {
    Coupon,
    CouponListElement,
    CouponResult, Discount,
    DiscountGroup,
    getDiscountGroupImg,
    ValidationResult
  } from "@/module/interface/Coupon";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import {CouponType} from "@/module/enum/CouponType";
  import {GetCartParams} from "@/module/interface/GetCartParams";
  import {CartResponse} from "@/module/respones/CartResponse";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  import {ApiHelper} from "@/api/ApiHelper";
  import CouponCell from "@/components/couponList/CouponCell.vue";
  import AlertModal from "@/components/baseComponents/AlertModal.vue";
  import AddCouponCell from "@/components/payment/AddCouponCell.vue";
  import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
  import {AppHelpers} from "@/common/AppHelpers";

  @Component({
    components: {MaskLoading, AddCouponCell, AlertModal, CouponCell}
  })
  export default class CouponListView extends Vue {
    // @ts-ignore
    private enableSelect: number = parseInt(this.$route.query.enableSelect) || 0
    private readonly couponListLogic: CouponListLogic = CouponListLogic.getInstance();
    private couponList: CouponListElement[] = [];
    private readonly cart: SyncApiCart = SyncApiCart.getInstance();
    private selectedCoupons: Map<string, string> = new Map<string, string>(); // Map<coupon group, promo code>
    private highlightLookup: any = {} // {coupon code: is valid}
    private alertContent: string = '';
    private settings: GlobalSettingPreference = GlobalSettingPreference.getInstance();
    private isCouponValidate: boolean = true;
    private addCouponModelErr: string = '';
    private typeInCouponCode: string = '';
    private appliedCouponCodes =  SyncApiCart.getInstance().getCouponCode();
    private isShowLoading = false
    private isShowTopBtn = false;

    async getCouponList() {
      this.isShowLoading = true
      try {
        let rs = await this.couponListLogic.fetchCouponList(this.typeInCouponCode, this.enableSelect === 1)
        let h = AppHelpers.getInstance()
        if (!h.isLogin(rs)) {
          h.goToLogin(this)
          return;
        }
        this.couponList = rs.data
      } catch (e) {
        this.alertContent = e
        this.$root.$emit('bv::show::modal', 'coupon-err');
      }
      this.isShowLoading = false
      this.typeInCouponCode = '';
    }

    mounted() {

      window.scrollTo(0, 0);
      this.getAutoMatchCoupons(this.appliedCouponCodes)
      window.onscroll = () => {
        let isTop = this.checkScrollToTop();
        this.isShowTopBtn = !isTop;
      }
    }


    async getAutoMatchCoupons(code: string) {
      await this.getCouponList();
      const rs =  await this.verifyInputPromoCode(code);
      if(rs.status){
        const discount = DiscountGroup.iniDiscount(rs.data.discount)
        this.searchResult(discount)
      }
    }


    isMatched(c1: string, c2: string) {
      return c1 === c2;
    }

    isInCoupons(code: string) {
      let c!: Coupon;
      for (let couponGroup of this.couponList) {
        for (let coupon of couponGroup.coupons) {
          if (this.isMatched(coupon.code, code)) {
            c = coupon
            break;
          }
        }
      }
      return c;
    }


    getGroupImg(discount_group: string): any {
      return getDiscountGroupImg(discount_group);
    }


    async selectCoupon(coupon: Coupon) {
      if (this.enableSelect === 0) return;
      this.isShowLoading = true
      if (this.isCouponSelected(coupon.code)) {
        this.cancelSelectedCoupon(coupon)
      } else {
        const verifyCouponsStr = this.getVerifyCouponsStr(coupon.discount_group, coupon.code);
        try {
          let response = await this.cart.validateCoupon(verifyCouponsStr)
          let status = response.status
          if (status) {
            this.addedToSelectedCoupons(coupon.discount_group, coupon.code);
          } else {
            this.alertContent = response.error
            this.$root.$emit('bv::show::modal', 'coupon-err');
          }
        } catch (e) {
          this.alertContent = e
          this.$root.$emit('bv::show::modal', 'coupon-err');
        }
      }
      this.isShowLoading = false
    }


    cancelSelectedCoupon(coupon: Coupon) {
      this.removeFromSelectedCoupon(coupon.code);
      this.updateHighlightLookup();
    }


    async onAddCouponConfirm(code: string) {
      if(!code){
        return
      }
      let response = await this.verifyInputPromoCode(code)
      this.isCouponValidate = response.status > 0;
      if (this.isCouponValidate) {
        this.addNewCoupon(response.data);
      } else {
        this.addCouponModelErr = response.error
      }
    }




    private async verifyInputPromoCode(code: string) {
      try {
        return await this.cart.validateCoupon(code);
      } catch (e) {
        return ApiHelper.getInstance().getErrorMessage(e);
      }
    }

    private addNewCoupon(result: ValidationResult): void {
      const discount = DiscountGroup.iniDiscount(result.discount)
      this.searchResult(discount)
    }

    searchResult(discount: DiscountGroup){
      if (discount.hasInternalDiscount()) {
        this.handleCouponHelper(discount.internal_discount);
      }
      if (discount.hasNormalDiscount()) {
        this.handleCouponHelper(discount.normal_discount);
      }
      if (discount.hasMemberDiscount()) {
        this.handleCouponHelper(discount.member_discount);
      }
      if (discount.hasOverLapDiscount()) {
        this.handleCouponHelper(discount.overlap_discount);
      }
    }


    public handleCouponHelper(c: Discount[]) {
      const inListResult = c.filter(discount=>{
        let coupon = this.isInCoupons(discount.coupon.code)
        //写入未能应用优惠码的提示
        coupon.error = discount.error
         return discount.valid === 1 && this.isInCoupons(discount.coupon.code)
       })
      const newResult = c.filter(discount=>{
        return discount.valid === 1 && !this.isInCoupons(discount.coupon.code)
      })
      if(inListResult.length != 0){
        inListResult.map(i=>
          this.addedToSelectedCoupons(i.coupon.discount_group, i.coupon.code))
      }
      if(newResult.length != 0){
        this.typeInCouponCode = newResult[0].coupon.code;
        this.getCouponList()
        this.addedToSelectedCoupons(newResult[0].coupon.discount_group, newResult[0].coupon.code)
      }
    }



    private isCouponSelected(code: string) {
      return !!this.highlightLookup[code];
    }

    private getVerifyCouponsStr(inputCouponGroup: string, inputCode: string): string {
      const verifyCouponArr: string[] = [];
      if (inputCouponGroup === CouponType.INTERNAL_DISCOUNT) {

      } else {
        this.selectedCoupons.forEach((code: string, couponGroup: string) => {
          if (couponGroup === inputCouponGroup) {
            verifyCouponArr.push(inputCode);
          } else {
            verifyCouponArr.push(code);
          }
        });
        if (verifyCouponArr.indexOf(inputCode) === -1) {
          verifyCouponArr.push(inputCode)
        }
      }
      return verifyCouponArr.join(',');
    }


    private addedToSelectedCoupons(couponGroup: string, code: string): void {
      if (couponGroup === CouponType.INTERNAL_DISCOUNT) {
        this.selectedCoupons.set(code, code);
      } else {
        this.selectedCoupons.set(couponGroup, code);
      }
      this.updateHighlightLookup();
    }




    private getSelectedCouponsStr(): string {
      const selectedCouponsArr: string[] = [];
      this.selectedCoupons.forEach((code: string) => {
        selectedCouponsArr.push(code);
      })
      return selectedCouponsArr.join(',');
    }


    private updateHighlightLookup(): void {
      this.highlightLookup = {};
      this.couponList.forEach((couponListEle) => {
        couponListEle.coupons.forEach((coupon) => {
          this.highlightLookup[coupon.code] = false;
        })
      })

      this.selectedCoupons.forEach((code) => {
        this.highlightCoupon(code);
      })
    }

    private highlightCoupon(code: string): void {
      this.highlightLookup[code] = true;
    }


    applyCoupons(): void {
      // @ts-ignore
      console.log(this.getSelectedCouponsStr())
      this.$router.replace({
        path: 'payment',
        query: {
          coupons: this.getSelectedCouponsStr()
        }
      })
    }


    private removeFromSelectedCoupon(inputCode: string): void {
      this.selectedCoupons.forEach((code: string, couponGroup: string) => {
        if (code === inputCode) this.selectedCoupons.delete(couponGroup);
      })
    }

    backToTop() {
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }

    private checkScrollToTop(): boolean {
      return document.documentElement.scrollTop == 0
    }


  }
</script>

<style scoped>


  @media screen and (max-width: 990px) {
    .addr_book_container {
      width: 90%;
    }


    .coupon_header {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }
  }

  .addr_book_container {
    margin: 0 auto;
  }

  .addr_book_view {
    margin-top: 100px;
    display: flex;
    flex-direction: row;
  }

  .left-blank {
    flex: 20%;
  }

  .main-section {
    flex: 60%;
  }

  .addr_book_wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .btn_wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .btn_wrap > button {
    max-width: 150px;
    height: 40px;
    background-color: var(--theme-red);
    color: white;
    border: none;
    margin: 10px 0;
    border-radius: 5px;
  }

  .coupon_header {
    justify-content: space-between;
    align-items: center;
  }

  .title-container {
    display: flex;
    margin-left: 30px;
    flex-direction: row;
  }

  .title {
    text-align: left;
    margin-left: 15px;
  }

  .addr_book_container {
    margin: 0 auto;
  }

  .addr_book_view {
    margin-top: 100px;
  }

  .addr_book_wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .btn_wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-left: 30px;
  }

  .btn_wrap > button {
    max-width: 150px;
    height: 40px;
    background-color: var(--theme-red);
    color: white;
    border: none;
    margin: 10px 0;
    border-radius: 5px;
  }

  .coupon_input_wrap {
    border: 1px solid lightgray;
    height: 46px;
    border-radius: 23px;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 2px;
    /*这里不设置宽度让内容自己撑起来*/
      /*width: 300px;*/
    justify-content: space-between;
  }

  .coupon_input_wrap > label {
    margin: 0;
  }

  .coupon_input_wrap > label > input {
    border: none;
    height: 40px;
    padding-left: 20px;
  }

  .coupon_input_wrap > label > input:focus {
    outline: none;
  }

  .coupon_input_wrap > button {
    border: none;
    background-color: var(--theme-red);
    border-radius: 20px;
    height: 40px;
    width: 70px;
    color: white;
  }

  .coupon_input_wrap > button:focus {
    outline: none;
  }

  .coupon_header {
    display: flex;
  }

  .input-text-error {
    border-color: var(--theme-red) !important;
  }

  .title_wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .title_wrap > img {
    width: 35px;
    height: 35px;
  }

  .to-top-container {
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 30px;
    height: 30px;
  }

  /*.to-top-container:hover {*/
  /*  bottom: 4vh;*/
  /*  transition: 0.2s;*/
  /*}*/
</style>
