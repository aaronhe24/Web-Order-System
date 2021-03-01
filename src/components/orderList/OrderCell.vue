<template>
  <div @click="onClickOrder" class="addr_book_cell">
    <div class="addr_icon_container flex_center">
      <img class="addr_icon"
           :src="order.shop_thumb"
           alt=""
      >
    </div>
    <div class="addr_info_container flex_center">
      <div class="order_cell_body">
        <div class="order_cell_body_left">
          <div class="text-truncate addr_text">{{order.shop_name}}</div>
          <p class="m-0">{{$t('payment_result.order_num')}}: {{order.order_id}}</p>
          <p class="m-0">{{$t('order.order_date')}}: {{order.order_time}}</p>
        </div>
        <div class="order_cell_body_right">
          <div class="text-truncate addr_text">${{order.order_total}}</div>
          <p class="m-0">{{shippingTypeStr}}</p>
          <p class="m-0 status">{{status}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import AddrBookCell from "@/components/addrBook/AddrBookCell.vue";
import {OrderHistory} from "@/module/interface/OrderHistory";
@Component({
  components: {AddrBookCell}
})
export default class OrderCell extends Vue {
  @Prop() private order!: OrderHistory;
  @Prop() private status!: string;
  @Prop() private shippingTypeStr!: string;

  // order how to get shop name?
  mounted() {

  }

  onClickOrder() {
    this.$emit('onClickOrder', this.order);
  }
}
</script>

<style scoped src="@/common/styles/addr-book-cell.css">
</style>
