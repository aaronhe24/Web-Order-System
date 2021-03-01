<template>
  <div class="cell_wrap">
    <div class="coupon_wrap" @click="onClickCoupon"
         :class="[
           getCouponCSSClass().bg,
           getCouponCSSClass().border,
           ]">
      <div class="left_half_cir_wrap">
        <div class="left_half_cir"
             :class="getCouponCSSClass().border"
        ></div>
      </div>
      <div class="right_half_cir_wrap">
        <div class="right_half_cir"
             :class="getCouponCSSClass().border"
        ></div>
      </div>
      <div class="upper_cell"
           :class="getCouponCSSClass().line"
      >
        <div class="title">{{coupon.title}}</div>
        <div class="text" v-if="isShowDetail">{{coupon.discount_desc}}</div>
        <div class="text" v-if="isShowDetail">{{$t('coupon.expire')}} {{coupon.end_date}}</div>
        <div v-if="!isShowDetail">
        <img class="lock_img_wrap"  v-if="highlightLookup[coupon.code]" src="../../assets/CouponListIcons/icon_lock_active@2x.png" alt="">
        <img class="lock_img_wrap"  v-if="!highlightLookup[coupon.code]"  src="../../assets/CouponListIcons/icon_lock@2x.png" alt="">
        </div>
        <div v-if="clickable && isShowDetail" class="select_coupon_img_wrap">
          <img v-show="highlightLookup[coupon.code] " src="../../assets/icon_checkbox_active@2x.png" alt="">
          <div v-show="!highlightLookup[coupon.code]" class="select_coupon_blank"
               :class="getCouponCSSClass().border"
          ></div>

        </div>
      </div>
      <div class="lower_cell">
        <p class="text" v-if="isShowDetail">{{coupon.rule_desc}}</p>
        <div class="text" v-if="!isShowDetail && !highlightLookup[coupon.code]">{{coupon.error}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {CouponType} from "@/module/enum/CouponType";
import {Coupon, DiscountGroup} from "@/module/interface/Coupon";

@Component({
  components: {}
})
export default class CouponCell extends Vue {
  @Prop() private coupon!: Coupon;
  @Prop() private highlightLookup!: any;
  @Prop() private clickable!: boolean;
  private isShowDetail = this.coupon.discount_group !== CouponType.INTERNAL_DISCOUNT;

  mounted() {}

  getCouponCSSClass(): {border: string, bg: string, line:string} {
    switch (this.coupon.discount_group) {
      case CouponType.OVERLAP_DISCOUNT:
        return {
          border: 'overlap_coupon_border',
          bg: 'overlap_coupon_bg_col',
          line: "overlap_coupon_line",
        }
      case CouponType.NORMAL_DISCOUNT:
        return {
          border: 'normal_coupon_border',
          bg: 'normal_coupon_bg_col',
          line: "normal_coupon_line",
        }
      case CouponType.MEMBER_DISCOUNT:
        return {
          border: 'vip_coupon_border',
          bg: 'vip_coupon_bg_col',
          line: "vip_coupon_line",

        }
      case CouponType.INTERNAL_DISCOUNT:
        return {
          border: 'internal_coupon_border',
          bg: 'internal_coupon_bg_col',
          line: "internal_coupon_line",
        }
      default:
        return {
          border: 'normal_coupon_border',
          bg: 'normal_coupon_bg_col',
          line: "normal_coupon_line",
        }
    }
  }

  onClickCoupon(): void {
    if(!this.isShowDetail){
      return;
    }
    this.$emit('onClickCoupon', this.coupon);
  }

}
</script>

<style scoped>
  @media screen and (max-width: 991px) {
    .cell_wrap {
      width: 500px;
    }
  }

  @media screen and (min-width: 991px){
    .cell_wrap {
      width: 50%;
    }
  }

  .cell_wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 35px;
    flex-direction: column;
  }

  .clickable {
    cursor: pointer;
  }

  .coupon_wrap {
    display: flex;
    flex-direction: column;
    width: 90%;
    position: relative;
    border-radius: 5px;
    padding: 0;
  }

  .no_desc_wrap_height {
    height: 128px!important;
  }

  .upper_cell {
    text-align: left;
    padding: 20px 0 0 40px;
    border-top: none!important;
    border-left: none!important;
    border-right: none!important;
  }

  .lower_cell {
    min-height: 20px;
    text-align: left;
    display: flex;
    align-items: center;
    padding-left: 40px;
  }

  .left_half_cir_wrap, .right_half_cir_wrap {
    overflow: hidden;
    position: absolute;
    top: 35px;
    height: 30px;
    width: 13px;
  }

  .left_half_cir_wrap {
    left: -1px;
  }

  .right_half_cir_wrap {
    right: -1px;
  }

  .left_half_cir, .right_half_cir {
    background-color: white;
    height: 30px;
    width: 26px;
    border-radius: 50%;
  }

  .left_half_cir {
    margin-left: -13px;
  }

  .right_half_cir {
    margin-right: -13px;
  }

  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    margin-right: 80px;
  }

  .text {
    color: #999999;
    font-size: 12px;
    margin-bottom: 5px;
  }

  .vip_coupon_border {
    border: 1px solid #F2E1B5;
  }

  .vip_coupon_bg_col {
    background-color: #FFFCF4;
  }

  .overlap_coupon_border {
    border: 1px solid #9BDDFF;
  }

  .overlap_coupon_bg_col {
    background-color: #F4FAFF;
  }

  .normal_coupon_border {
    border: 1px solid #FFC0B1;
  }

  .normal_coupon_bg_col {
    background-color: #FCF4ED;
  }

  .internal_coupon_border {
    border: 1px solid var(--border-color);
  }

  .internal_coupon_bg_col {
    background-color: #F8F8F8;
  }

  .vip_coupon_line {
    border: 1px dashed #F2E1B5;
  }

  .overlap_coupon_line {
    border: 1px dashed #9BDDFF;
  }
  .normal_coupon_line {
    border: 1px dashed #FFC0B1;
  }

  .internal_coupon_line {
    border: 1px dashed var(--border-color);
  }


  .select_coupon_img_wrap {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 17px;
    right: 33px;
    border-radius: 50%;
    overflow: hidden;
  }

  .lock_img_wrap {
    width: 21px;
    height: 26px;
    position: absolute;
    top: 17px;
    right: 33px;
    overflow: hidden;
  }


  .select_coupon_img_wrap > img {
    width: 100%;
  }

  .select_coupon_blank {
    background-color: white;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
</style>
