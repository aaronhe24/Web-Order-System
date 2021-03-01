<template>
  <div class="option">
    <div style="margin-bottom: 20px">
      <div :class="labelCellStyle">
        <div id="label-name1" class="label">{{option.label}}</div>
        <div v-if="option.min === 0" class="label-desc">{{$t('shop.item_option')}} {{option.max}} </div>
        <div v-if="option.min > 0" class="label-desc" style="color: var(--theme-red)">{{$t('shop.item_require')}}</div>
      </div>
      <div v-for="(item, index) in items" class="item-cell">
        <check-product-items :optionType="option.type" :optionMax="option.max"
                             :index="index" :item="item"
                             @add="addQty" @reduce="reduceQty"
                             @onCheckBoxPress = "onCheckboxPress"
                             @onRadioPress ="onRadioClick"
        />
      </div>
    </div>

<!--    <div v-if="option.type === 'radio'">-->
<!--      <div class="label-cell" style="margin-bottom: 20px">-->
<!--        <div id="label-name2" class="label">{{option.label}}</div>-->
<!--        <div v-if="option.min === 0" class="label-desc">{{$t('shop.item_option')}} {{option.max}} </div>-->
<!--        <div v-if="option.min > 0" class="label-desc" style="color: var(&#45;&#45;theme-red)">{{$t('shop.item_require')}}</div>-->
<!--      </div>-->
<!--      <div v-for="(item, index) in items" class="item-cell">-->
<!--          <CircleCheckBox :id="item.name" @onChecked="onRadioClick(item, index)" :des="item.name"-->
<!--                          :is-checked="radioChecked[index]" style="margin-top: -5px" :enableTextBold ="true"/>-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Option, OptionType} from "@/module/interface/Option";
  import {Item} from "@/module/interface/Item";
  import CircleCheckBox from "@/components/baseComponents/CircleCheckBox.vue";
  import CheckProductItems from "@/components/shop/CheckProductItems.vue";

  @Component({
    components: {CheckProductItems, CircleCheckBox}
  })
  export default class ProductDetailCell extends Vue {
    @Prop() private option!: Option
    @Prop() private optionIndex!: number
    private label: string = this.option.label
    private items: Item[] = this.initItems();
    private checkQty:number = 0;
    private prevCheckedIndex: number[] = [];
    private labelCellStyle = 'label-cell'
    private preIndex: number = -1;

    mounted() {

    }

    checkQtyEnable(): boolean{
      //qty 检查只针对 check box
     return this.checkQty>0 && this.option.type === OptionType.Radio
    }

    @Watch('checkQty',{deep:true})watchItems(value:number){
       if(!this.checkQtyEnable()){
         return;
       }
      this.$emit("onOptionUnChecked", this.optionIndex)
    }

    initItems() {
      let items = this.option.items
      items.map(i => {
        i.checked = 0
        i.qty = 0
      })
      return items
    }

    onRadioClick(item: Item, index: number) {
      //不允许过量点击
      if(this.isHitMax() && index === this.preIndex){
        return;
      }
      this.$emit("onOptionChecked", this.optionIndex)
      this.checkQty = 0;
      this.initItems();
      item.checked = 1;
      item.qty = 1;
      this.preIndex = index;
    }

    /**
     * 暂时不用
     */
    optionLimitFilter(){
      let length = this.prevCheckedIndex.length;
      let max = this.option.max
      if(length <=0 ){
        return;
      }
      this.prevCheckedIndex = this.prevCheckedIndex.slice(length - max, length);
    }

    onCheckboxPress(item: Item, index: number){
      //不允许过量点击
      if(this.isHitMax() && !item.isChecked()){
        this.showReachLimit();
        return;
      }
      item.checked = item.checked === 1 ? 0 : 1;
      item.qty = item.isChecked() ? 1 : 0;
      item.isChecked() ? this.addCheckQty() : this.rdcCheckQty()
      if(!this.checkQty){
        return;
      }
      this.$emit("onOptionChecked", this.optionIndex)
    }

    showReachLimit(){
      this.labelCellStyle = 'label-cell-over-limit'
      let that = this

      setTimeout(function(){
        that.labelCellStyle = 'label-cell'
      }, 400);
    }

    addCheckQty(){
      this.checkQty = this.checkQty + 1;
    }

    rdcCheckQty(){
      this.checkQty = this.checkQty - 1;
    }




    isHitMax(): boolean{
      return this.checkQty === this.option.max
    }

    addQty(item: Item) {
      this.$emit("onOptionChecked", this.optionIndex)
      if(this.isHitMax()){
        this.showReachLimit();
        return;
      }
      this.addCheckQty()
      item.qty = item.qty + 1;
      item.checked = 1
    }

    initQty(item: Item) {
      item.qty = 0;
      item.checked = 0;
    }

    reduceQty(item: Item) {
      this.rdcCheckQty()
      if (item.qty <= 1) {
        this.initQty(item)
        return
      }
      item.qty = item.qty - 1;
    }

  }
</script>

<style scoped>
  .option{

  }
  .label{
    font-weight: bold;
    font-size: 16px;
  }
  .label-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--border-color);
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .label-cell-over-limit {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--theme-red);
    opacity: .4;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .label-desc {
    font-size: 12px;
    color: var(--gray);
  }

  .item-cell {
    padding-left: 20px;
    padding-right: 20px;
  }




</style>
