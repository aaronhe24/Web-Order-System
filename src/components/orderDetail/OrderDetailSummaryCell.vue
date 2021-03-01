<template>
  <div class="cell_body"
       :class="(idx===len-1)?'':'gray_bot_border'"
  >
    <div class="cell_left">
      <p>{{item.qty}} x</p>
    </div>
    <div class="cell_mid">
      <p>{{item.name}}</p>
      <div class="option_txt_wrap">
        <p class="addition" v-for="(optionTxt, idx) in optionTxtArr"
          :key="idx"
        >
          {{optionTxt}}
        </p>
      </div>
      <p class="note" v-show="!(item.note==='')">Note: {{item.note}}</p>
    </div>
    <div class="cell_right">
      ${{item.price}}
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {OrderItem} from "@/module/interface/OrderHistory";
import {getOptionsString} from "@/module/interface/OrderDetail";

  @Component
  export default class OrderDetailSummaryCell extends Vue {

    @Prop() private item!: OrderItem;
    @Prop() private idx!: number;
    @Prop() private len!: number;
    private optionTxtArr: string[] = [];

    mounted() {
      this.optionTxtArr = getOptionsString(this.item);
    }

  }
</script>

<style scoped>
  .cell_body {
    display: flex;
    padding: 20px 0;
  }

  .gray_bot_border {
    border-bottom: 1px var(--border-color) solid;
  }

  .cell_left {
    flex: 5%;
    max-width: 5%;
    //padding-top: 5px;
    font-weight: bold;
  }

  .cell_mid {
    flex: 80%;
    max-width: 80%;
  }

  .cell_right {
    flex: 15%;
    max-width: 15%;
    text-align: right;
  }

  .addition {
    color: #999999;
    font-size: 14px;
    margin-right: 10px;
  }

  .option_txt_wrap {
    display: flex;
    flex-wrap: wrap;
  }

  .note {
    padding-top: 10px;
    font-size: 14px;
  }

  p {
    margin-bottom: 3px;
  }
</style>
