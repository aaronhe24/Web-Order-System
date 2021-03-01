<template>
  <div class="success-wrap">
    <div class="success-container">
      <div>
        <img src="" alt="">
      </div>
      <div>
        <h2>{{$t('payment_result.fail_title')}}</h2>
        <br>
        <h5 v-if="orderNum">{{$t('payment_result.order_num')}}: {{orderNum}}</h5>
        <br>
        <p>{{ desc ? desc : $t('payment_result.failed_desc')}}</p>
        <br>
        <div class="btn_group">
          <button v-if="orderNum"
            class="order_detail_btn" @click="clickOrderDetail">{{$t('payment_result.order_detail')}}</button>
          <button class="continue_btn" @click="clickContinue">{{$t('payment_result.continue')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {GlobalSettingPreference} from "@/GlobalSettingPreference";

@Component
export default class PaymentFailView extends Vue {
  private orderNum: number = parseInt(this.$route.query.orderId as string);
  private desc = this.$route.query.error;
  private global: GlobalSettingPreference = GlobalSettingPreference.getInstance();

  mounted() {
    window.scrollTo(0, 0);
  }

  clickOrderDetail() {
    this.$router.replace(
      {
        name: 'OrderDetailView',
        query: {
          orderNum: this.orderNum.toString()
        }
      }
    );
  }

  clickContinue() {
    this.$router.replace(
      {
        name: 'RestaurantListView',
        query: {
          cityId: this.global.getAddressInfo().cityId.toString()
        }
      }
    );
  }
}
</script>

<style scoped>

@media screen and (max-width: 600px) {
  .success-container {
    width: 100%;
    height: 800px;
    margin: 0 auto;
    padding: 10%;
  }
}

@media screen and (min-width: 601px){
  .success-container {
    border: 1px var(--border-color) solid;
    width: 650px;
    margin: 0 auto;
    padding: 55px 140px;
  }
}

.success-wrap {
  margin-top: 100px;
  height: 1000px;
}

.success-container {

}

.btn_group {
  display: flex;
  justify-content: space-evenly;
}

.btn_group > button {
  width: 135px;
  height: 45px;
  border-radius: 5px;
}

.order_detail_btn {
  background-color: var(--theme-red);
  color: white;
  border: none;
}

.continue_btn {
  background-color: white;
  border: 1px var(--border-color) solid;
}

</style>
