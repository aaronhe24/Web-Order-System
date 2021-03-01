<template>
  <label class="check-label" :for="labelFor">
    <div class="check-cell" v-if="!isOutOfStock">
    <b-button :id="'re-button' + item.name + 'multi'" class="qty-button"
              v-if="qty>0 && optionMax > 1"
              @click="reduceQty(item)">
      <img src="../../assets/product/icon_qty_reduce.png" alt="">
    </b-button>

    <div id="qty" v-if="qty >0 && optionMax > 1">{{qty}}</div>
    <b-button :id="'add-button' + item.name + 'multi'"  class="qty-button"
              @click="addQty(item)"
              v-if="optionMax > 1"
    >
      <img v-if="qty <= 0"  src="../../assets/product/icon_add_btn_gray.png" alt="">
      <img v-if="qty > 0"  src="../../assets/product/icon_qty_add.png" alt="">
    </b-button>

    <b-button :id="'add-button' + item.name + 'radio'" class="qty-button"
              @click="onRadioPress(item)"
              v-if="optionType==='radio' && optionMax === 1"
    >
      <img v-if="isChecked" src="../../assets/product/icon_radio.png" alt="">
      <img v-if="!isChecked" src="../../assets/product/icon_radio_gray.png" alt="">
    </b-button>

    <b-button :id="'add-button' + item.name + 'checkbox'" class="qty-button"
              @click="onCheckboxPress(item)"
              v-if="optionType==='checkbox' && optionMax === 1"
    >
      <img v-if="isChecked" src="../../assets/product/icon_checkbox.png" alt="">
      <img v-if="!isChecked" src="../../assets/product/icon_checkBox_gray.png" alt="">
    </b-button>
    </div>
    <div class="desc">{{item.name}}</div>
    <div class="item-price" v-if="item.price >0"> + ${{item.price}}</div>
    <div class="out-of-stock" v-if="isOutOfStock">{{$t('order.out_of_stock')}}</div>
  </label>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Item} from "@/module/interface/Item";
  import {OptionType} from "@/module/interface/Option";

  @Component
  export default class CheckProductItems extends Vue {
    @Prop() private index!: number;
    @Prop() private item!: Item;
    @Prop() private optionType!: string;
    @Prop() private optionMax!:number;
    private qty: number =0;
    private isRdcOnclick = false;
    private isChecked = false;
    private isOutOfStock = this.item.isOutOfStock();
    private itemType = this.optionMax > 1 ? 'multi'
      : (this.optionType === OptionType.Radio ? OptionType.Radio
                                              : OptionType.CheckBox )
    private labelFor = 'add-button' + this.item.name + this.itemType


    @Watch('item', {deep:true})watchItem(value:Item){
        this.qty = this.item.qty
      this.isChecked = value.checked === 1;
      this.isOutOfStock = this.item.isOutOfStock();
    }



    mounted() {

    }

    isRadioMultiFirstAdd(item: Item): boolean{
      return this.optionMax >1 && this.optionType === OptionType.Radio && item.qty === 0;
    }


    addQty(item: Item){
      if(this.isOutOfStock){
        return
      }
       if(this.isRadioMultiFirstAdd(item)){
         this.onRadioPress(item)
         return;
       }
        //避免双重点击
        var that = this
        setTimeout(function() {
          if(that.isRdcOnclick){
            that.isRdcOnclick = false;
            return;
          }
          that.$emit("add", item, that.index)
        }, 50);
    }

    onCheckboxPress(item: Item){
      if(this.isOutOfStock){
        return
      }
       this.$emit('onCheckBoxPress', item, this.index)
    }

    onRadioPress(item: Item){
      if(this.isOutOfStock){
        return
      }
      this.$emit('onRadioPress', item, this.index)
    }



    reduceQty(item: Item){
      if(this.isOutOfStock){
        return
      }
      this.isRdcOnclick = true;
      this.$emit("reduce", item, this.index)
    }


  }
</script>

<style scoped>
  .check-label {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
  }

  .check-cell {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
  }

  .out-of-stock{
    color: var(--dark-gray);
    font-size: 12px;
    margin-left: 20px;
  }

  .desc {
    font-size: 16px;
    color: var(--dark-black);
    font-weight: bold;
    margin-left: 20px;
  }

  .btn:focus {
    outline: 0;
    box-shadow: none !important;
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
    outline: 0;
    box-shadow: none !important;
  }

  .item-price{
    font-size: 12px;
    margin-left: 20px;
    color: var(--gray);
    margin-top: 3px;
  }

  #qty {
    font-size: 14px;
    margin-left: 10px;
    margin-right: 10px;
  }


</style>
