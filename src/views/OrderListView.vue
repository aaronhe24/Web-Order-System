<template>
  <div class="addr_book_view">
    <h2 class="addr_book_container title p-3">{{$t('common.orders_label')}}</h2>

    <h4 class="addr_book_container title p-3">{{$t('order.processing')}}</h4>
    <NoDataView style="margin-top: 10px"
                class="addr_book_container"
                :content="$t('common.no_results')"
                v-if="processingOrderList.length < 1"/>

    <div class="addr_book_wrap addr_book_container">
      <order-cell v-for="(order, idx) in processingOrderList"
                  :order="order"
                  :status="getOrderStatusText(order.status)"
                  :key="idx"
                  v-on:onClickOrder="onClickOrder"
                  :shipping-type-str="getDeliveryTypeStr(order)"
      ></order-cell>
    </div>

    <h4 class="addr_book_container title p-3">{{$t('order.finished')}}</h4>
    <NoDataView style="margin-top: 10px"
                class="addr_book_container"
                :content="$t('common.no_results')"
                v-if="finishedOrderList.length < 1"/>

    <div class="addr_book_wrap addr_book_container">
      <order-cell v-for="(order, idx) in finishedOrderList"
                  :order="order"
                  :status="getOrderStatusText(order.status)"
                  :key="idx + finishedOrderListIdx"
                  v-on:onClickOrder="onClickOrder($event)"
                  :shipping-type-str="getDeliveryTypeStr(order)"
      ></order-cell>
    </div>

    <MaskLoading :isShow="isShowLoading"/>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import AddrBookCell from "@/components/addrBook/AddrBookCell.vue";
    import OrderCell from "@/components/orderList/OrderCell.vue";
    import {OrderListLogic} from "@/logic/orderListLogic/OrderListLogic";
    import {OrderHistory} from "@/module/interface/OrderHistory";
    import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
    import NoDataView from "@/components/baseComponents/NoDataView.vue";
    import {OrderDetailLogic} from "@/logic/orderDetailLogic/OrderDetailLogic";
    import {AppHelpers} from "@/common/AppHelpers";
    import {DeliveryType} from "@/module/enum/DeliveryType";

    @Component({
      components: {OrderCell, AddrBookCell,MaskLoading,NoDataView}
    })
    export default class OrderListView extends Vue {
        private processingOrderList: OrderHistory[] = [];
        private finishedOrderList: OrderHistory[] = [];
        private finishedOrderListIdx: number = 0;
        private orderListLogic: OrderListLogic = OrderListLogic.getInstance();
        private isShowLoading =  false;

        orderStatusText = [this.$t('order.processing'),this.$t('order.cooking'),this.$t('order.delivering'),this.$t('order.finished'), this.$t('payment_status.upapaid')]

      mounted() {
          window.scrollTo(0, 0);
          this.isShowLoading = true
          this.fetchOrderList();
        }

       async fetchOrderList() {
          try{
            let rs = await this.orderListLogic.fetchOrderHistory()
            let h = AppHelpers.getInstance()
            if(!h.isLogin(rs)){
              h.goToLogin(this)
              return ;
            }
            this.processingOrderList = this.orderListLogic.getProcessingOrderList();
            this.finishedOrderList = this.orderListLogic.getFinishedOrderList();
            this.finishedOrderListIdx = this.processingOrderList.length;
            this.isShowLoading = false
          }catch (e) {
            console.log(e)
          }
        }

        onClickOrder(order: OrderHistory) {
          this.$router.push(
            {
              name: 'OrderDetailView',
              query: {
                orderNum: order.order_id.toString()
              }
            }
            )
          }

          getStatusIndex(status:number){
            return OrderDetailLogic.getInstance().getOrderStatusIdx(status)
          }

          getOrderStatusText(status:number){
            const s = this.getStatusIndex(status)
            if( s<0){
              return this.$t('order.cancelled')
            }

            return this.orderStatusText[s]
          }




          getDeliveryTypeStr(order: OrderHistory): string {
            switch (order.shipping_type) {
              case DeliveryType.Delivery:
                return this.$t('order.delivery') as string;
              case DeliveryType.Pickup:
                return this.$t('order.pick_up') as string;
              default:
                return '';
            }
          }
    }
</script>

<style scoped>

  @media screen and (max-width: 991px) {
    .addr_book_container {
      width: 90%;
    }
  }

  @media screen and (min-width: 991px){
    .addr_book_container {
      width: 64rem;
    }
  }

  .title {
    text-align: left;
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
</style>
