<template>
  <div class="container">
    <stripe-elements
      class="strip-box"
      ref="elementsRef"
      :pk="publishableKey"
      :amount="amount"
      locale="ca"
      @token="tokenCreated"
      autofocus
    >
    </stripe-elements>
    <div style="display: flex;flex-direction: row;width: 100%">

    </div>

  </div>
</template>


<script>
  import { StripeElements } from 'vue-stripe-checkout';
  import {PaymentLogicV1} from "@/logic/paymentLogic/PaymentLogicV1";
  import {StripeKey} from "@/logic/paymentLogic/Stripe";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";
  export default {
    components: {
      StripeElements
    },
    props:["amount", "submit"],
    data: () => ({
      loading: false,
      publishableKey: GlobalSettingPreference.getInstance().isDev() ? StripeKey.TestStripe : StripeKey.LiveStripe
    }),
    mounted() {
      this.$emit('sendElRef',this.$refs.elementsRef)
    },
    methods: {
      // submit () {
      //
      //
      // },
      tokenCreated (token) {
        this.$emit('onTokenCreated', token);
        // this.sendTokenToServer();
      },
      // sendTokenToServer(){
      //   PaymentLogicV1.getInstance().createCharge()
      // },


    }
  }
</script>
<style scoped>
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

.strip-box{
  display: inline-block;
  width: 100%;
  border-radius: 4px;
}
  .place-order-text{
    font-weight: bold;
    font-size: 14px;
  }
</style>
