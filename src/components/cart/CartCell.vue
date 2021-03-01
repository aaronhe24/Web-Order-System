<template>
  <div class="order-cell">
    <div style="width: 30px"  v-if="!isShowGift">
      {{product.qty}}&#160&times
    </div>
    <div class="inner-cell">
      <div class="order-name-cell">
        <div class="order-name" align="left" :style="isShowGift ? 'color: var(--theme-red)' : ''">
         {{product.product_name}}
        </div>
        <div class="price-container" v-if="!isShowGift">
          <OrgPriceCell style="margin-bottom: 2px" :price="orgRowTotal" :color="'var(--dark-gray)'"
                        v-if="isSpecial"
          />
          <div class="order-name" style="justify-content: flex-end; margin-right: 15px;min-width: 0">
            ${{rowTotal}}
          </div>
        </div>
      </div>

      <div align="left" class="order-option">
        {{product.productToString()}}
      </div>

      <div align="left" class="order-option" v-if="product.note">
        Note: {{note}}
      </div>
      <button class="rm" @click="onRmClick" v-if="!isShowGift">
        Remove
      </button>
    </div>
  </div>

</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import {Product} from '@/module/Product';
  import {Option} from "@/module/interface/Option";
  import CartOptionCell from "@/components/cart/CartOptionCell.vue";
  import OrgPriceCell from "@/components/cart/OrgPriceCell.vue";

  @Component({
    components: {OrgPriceCell, CartOptionCell}
  })
  export default class CartCell extends Vue {
    @Prop() private product!: Product;
    private isShowGift = this.product.qty === -1
    private isSpecial = this.product.isShowDiscount();
    private note = this.product.note
    private orgRowTotal = this.product.org_row_total ? this.product.org_row_total : this.product.calculateOrgRowTotal()
    private rowTotal = this.product.row_total ? this.product.row_total : this.product.calculateRowTotal()

    @Watch('product',{deep: true})watchProduct(value:Product){
      this.product = value;
      this.isSpecial = value.isShowDiscount();
      this.note = value.note;
      this.orgRowTotal = value.org_row_total ? value.org_row_total : value.calculateOrgRowTotal()
      this.rowTotal = value.row_total ? value.row_total : value.calculateRowTotal()
    }

    mounted() {
    }

    onRmClick() {
      this.$emit("onRmProductClick", this.product)
    }
  }

</script>

<style scoped>
  .price-container{
    display: flex;
    flex-direction: row;
    min-width: 150px;
    align-items: flex-end;
    justify-content: flex-end;
  }
  .order-cell {
    display: flex;
    margin: 15px;
    flex-direction: row;
    width: 100%;
  }

  .inner-cell {
    display: flex;
    flex-direction: column;
    /*min-width: 295px;*/
    width: 100%;
    margin-left: 10px;
  }
  .order-name-cell{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

  }

  .order-name {
    color: var(--dark-black);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    word-break: break-all;
    min-width: 60px;
  }

  .order-option {
    color: var(--gray);
    font-size: 12px;
    margin-top: 0px;
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    word-break: break-all;
  }

  .rm {
    color: var(--theme-red);
    font-size: 12px;
    margin-top: 10px;
    border-width: 0;
    background-color: white;
    padding: 0;
    outline: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

</style>
