<template>
   <div class="cell-container">
     <div class="left-cell">
       <img :src="discount.getDiscountGroupImg()" class="img">
       <div class="coupon-desc-text">
         {{discount.desc}}
       </div>
     </div>
     <div class="coupon-amount-text">
       {{discount.amount_desc}}
     </div>
   </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
    import {Discount, DiscountGroup} from "@/module/interface/Coupon";

    @Component
    export default class PaymentCouponCell extends Vue {
        @Prop()private discount!: Discount

      @Watch('discount')watchDiscount(newValue: Discount){
          this.discount = newValue
      }

        mounted() {

        }
    }
</script>

<style scoped>
  .cell-container{
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .img{
    width: 22px;
    height: 22px;
  }

  .left-cell{
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .coupon-amount-text{
     font-size: 14px;
     color: var(--theme-red);
  }

  .coupon-desc-text{
    font-size: 14px;
    color: var(--dark-black);
    margin-left: 5px;
  }

</style>
