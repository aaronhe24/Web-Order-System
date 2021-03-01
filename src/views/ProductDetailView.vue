<template>
  <div>
    <b-modal v-bind="$attrs"
             ok-only
             scrollable
             class="b-container"
             header-class="header"
             @hide="onClickCancel"
             hide-header
             centered
    >
      <div class="product-container">
        <button class="btn-dismiss" @click="onClickCancel">
          <img src="../assets/icon_dismiss@2x.png" style="width: 35px">
        </button>
<!--        <img class="product-img" :src="product.product_image ? product.product_image : require(`../assets/shop/shop_default_img@2x.png`)"/>-->
        <img class="product-img" v-if="product.product_image" :src="product.product_image"/>
        <div v-else style="height: 60px"></div>

        <div class="header-container">
          <div class="name-line">
            <div class="product-name">{{product.product_name}}</div>
            <div style="display: flex; flex-direction:row; align-items: flex-end">
              <OrgPriceCell :color="'black'" :price="product.org_price" style="margin-bottom: 5px" />
              <div class="product-price">${{product.price}}</div>
            </div>
          </div>
          <div :class="outOfStyle" v-if="isOutOfStock">{{$t('order.out_of_stock')}}</div>

            <div class="product-desc">{{product.product_desc}}</div>
        </div>
        <div v-for="(option, optionIndex) in product.options">
          <ProductDetailCell :option="option" :optionIndex="optionIndex"
                             @onOptionChecked="onOptionChecked"
                             @onOptionUnChecked="onOptionUnChecked"
          />
        </div>

        <div class="note-container">
          <div class="note-title">{{$t('shop.add_product_note_title')}}</div>
          <label for="add_note" >
            <textarea type="text" id="add_note" class="note-board" v-model="note">{{displaynote}}</textarea>
          </label>
        </div>



      </div>

      <template #modal-footer>
        <div class="footer-container">
          <div class="qty-container">
            <button class="qty-button"  @click="onClickReduceProduct">
              <img src="../assets/product/icon_reduce.png" alt="">
            </button>
            <div class="qty-text">{{product.qty}}</div>
            <button class="qty-button" @click="onClickAddProduct">
              <img src="../assets/product/icon_add.png" alt="">
            </button>
          </div>
          <button :class="addDisable ? 'add-cart-btn' : 'add-cart-btn-active'"  @click="onClickOk" :disabled = "addDisable">
            <div class="add-text">{{$t('shop.add_to_cart')}}</div>
            <div class="add-text">${{rowTotal}}</div>
          </button>
        </div>
      </template>

    </b-modal>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Product} from "@/module/Product";
  import ProductDetailCell from "@/components/shop/ProductDetailCell.vue";
  import {Option} from "@/module/interface/Option";
  import {AppHelpers} from "@/common/AppHelpers";
  import {SyncApiCart} from "@/logic/cart/SyncApiCart";
  import OrgPriceCell from "@/components/cart/OrgPriceCell.vue";

  @Component({
    components: {OrgPriceCell, ProductDetailCell},
  })

  export default class ProductDetailView extends Vue {
    @Prop() private product!: Product
    private note: string = this.product.note;
    private displaynote: string = this.product.note;
    private cart: SyncApiCart = SyncApiCart.getInstance();
    private addDisable:boolean = true
    private productCheckedOptions: boolean[] = [];
    private optionalOptionsIndex!: number[];
    private rowTotal: number= 0;
    private outOfStyle = "out-of-stock"
    private isOutOfStock = this.product.isOutOfStock()
    private isRLimit = (this.cart.inCartDisNumber(this.product.product_id) >= this.product.discount_limit_times)



    mounted() {

    }

    // @Watch('productCheckedOptions')watchChecked(value: boolean[]){
    //   if(!this.productCheckedOptions){
    //     return;
    //   }
    //   this.addDisable =  !this.isCheckedOption() || this.product.qty <=0
    // }


    @Watch('product', {deep:true})watchProduct(value: Product){
      let that = this
      this.isOutOfStock = this.product.isOutOfStock()
      //等待emit传值
      setTimeout(function(){
        that.onProductChanged()
      }, 70);
      let c = this.cart.inCartDisNumber(this.product.product_id);
      let haslimit = this.product.discount_limit_times > 0;
      this.isRLimit = haslimit && c >=this.product.discount_limit_times
      let olimit = this.product.qty > this.product.discount_limit_times

      if(!this.isRLimit) {
        this.product.dis_qty = haslimit && olimit
          ? this.product.discount_limit_times
          : this.product.qty
      }


      this.calRowTotal()
      this.displaynote = this.product.note;

    }

    onProductChanged(){
      if(this.isOutOfStock){
        this.addDisable = true
        return
      }
      if(this.product.hasOption()){
        this.addDisable =  !this.isCheckedOption() || this.product.qty <=0
      }else {
        this.addDisable = this.product.qty <=0;
      }
    }

    initCheckedOptions(){
      //记录选项是否选过的数组
      this.productCheckedOptions = this.product.hasOption()
        ? this.product.options.map(o => {
            return o.min === 0;
          }
        )
        : []
     //记录选项是option的数组，方便之后剔除
      this.optionalOptionsIndex =  this.product.hasOption()
        ? this.product.options.map(o=>{
          return o.min === 0 ? this.product.options.indexOf(o) : -1;
        }) : []

      // console.log(this.productCheckedOptions)
      // console.log(this.optionalOptionsIndex)

    }


    isCheckedOption(): boolean{
      //先检查product是否已经传入
      if(this.productCheckedOptions.length === 0){
        this.initCheckedOptions()
        return false;
      }
      let c = []
      c = this.productCheckedOptions.filter(p=>
        //剔除返回值是false的， 以及选项是option的
       !p && this.optionalOptionsIndex[this.productCheckedOptions.indexOf(p)] === -1)
      return c.length === 0
    }

    setDiscountQty(q: number){

    }


    onOptionChecked(index:number){
      this.productCheckedOptions[index] = true;
    }

    onOptionUnChecked(index:number){
      this.productCheckedOptions[index] = false;
    }


    calRowTotal(){
      return this.rowTotal = this.product.calculateRowTotal()
    }

    onClickAddProduct(): void {
      this.product.qty = this.product.qty + 1
      this.calRowTotal();
      // this.isReachLimit = this.isReachSpecialLimit()
    }

    onClickReduceProduct(): void {
      this.product.qty = this.product.qty === 1 ? 1 : this.product.qty - 1;
      this.calRowTotal()
      // this.isReachLimit = this.isReachSpecialLimit()
    }

    onClickOk() {
      //提交时，加入note
      if(this.isOutOfStock){
        // this.highLightOutOfStock();
        return
      }
      this.product.note = this.note ? this.note : this.product.note
      this.note = '';
      this.clear();
      this.$emit('onClickOK', this.product)
    }

    // highLightOutOfStock(){
    //   let that = this
    //   that.outOfStyle = "out-of-stock-active"
    //   setInterval(function(){
    //    that.outOfStyle = "out-of-stock"
    //   }, 200);
    // }


    onClickCancel(){
      //退出时清空选项管理数组
      this.clear();
      this.$emit('onClickCancel')
    }

    clear(){
      this.productCheckedOptions = []
      this.optionalOptionsIndex = []
    }

  }
</script>

<style scoped>

  .header {
    border-bottom: 0px;
  }

  .out-of-stock{
    color: var(--dark-gray);
    font-size: 18px;
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 15px;
  }

  .out-of-stock-active{
    color: var(--theme-red);
    font-size: 18px;
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 15px;
  }


  .product-container{
    position: relative;
    display: flex;
    flex-direction: column;
    margin: -16px;
  }

  .header-container{
    display: flex;
    flex-direction: column;
    padding-top: 15px;
    padding-bottom: 15px;
    width: 100%;
  }

  .product-name{
    font-size: 28px;
    font-weight: bold;
    color: var(--dark-black);
  }

  .product-desc{
    margin-left: 20px;
    margin-right: 20px;
    font-size: 12px;
    color: var(--dark-gray);
    word-break: break-all;
  }

  .product-price{
    font-size: 24px;
    font-weight: bold;
    color: var(--dark-black);
  }

  .name-line{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
  }

  .check-cell {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .product-img{
    width: 100%;
    object-fit: cover;
    height: 225px;
    /*background-color: #FC3245;*/
  }


  .icon {
    flex-direction: row;
    color: orangered;
    position: center;
  }

  .note-container{
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    padding-left: 20px;
    margin-bottom: 20px;
  }

  .note-title{
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 5px;
    color: var(--dark-black);
    font-weight: bold;
  }
  .note-board{
    height: 75px;
    width: 100%;
    background-color: #FCFCFC;
    border-radius: 5px;
    border:0;
    outline: 0;
    padding: 10px;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .note-board{
    border-radius: 5px;
    border:1px solid var(--border-color);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .qty-container{
    display: flex;
    flex-direction: row;
    border:1px solid var(--border-color);
    border-radius: 25px;
    background-color: white;
    align-items: center;
    outline: 0;
    box-shadow: none;
  }

  .qty-button{
    border: 0;
    height: 50px;
    background-color: transparent;
    outline: 0;
    box-shadow: none;
    padding-left: 20px;
    padding-right: 20px;
  }

  .qty-text{
    font-size: 14px;
  }

  .add-cart-btn-active{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    width: 250px;
    background-color: var(--theme-red);
    border-radius: 5px;
    border: 0;
    outline: 0;
    box-shadow: none;
    padding-right: 20px;
    padding-left: 20px;
  }

  .add-cart-btn{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    width: 250px;
    background-color: var(--dark-gray);
    border-radius: 5px;
    border: 0;
    outline: 0;
    box-shadow: none;
    padding-right: 20px;
    padding-left: 20px;
  }

  button{
    outline: 0;
    box-shadow: none;
  }


  .footer-container{
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0px;
  }

  /deep/ .modal-footer {
    /*margin-top: 20px;*/
    background-color: var(--border-color);
  }

  .add-text{
    font-size: 16px;
    font-weight: bold;
    color: white;

  }

  .btn-dismiss{
    position: absolute;
    top: 20px;
    right: 12px;
    border: 0;
    background-color: transparent;
  }



</style>
