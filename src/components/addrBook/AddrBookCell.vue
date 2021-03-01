<template>
  <div class="addr_book_cell" @click="onCardClick">
    <div class="addr_icon_container flex_center">
      <img class="addr_icon"
           style="width: 30px;height: 35px"
           src="../../assets/HomeIcons/icon_address@2x.png"
           alt="">
    </div>
    <div class="addr_info_container flex_center">
      <div>
        <div class="text-truncate addr_text">{{addrInfo.address}}</div>
        <p class="m-0">{{addrInfo.name}}</p>
        <p class="m-0">{{addrInfo.tel}}</p>
      </div>
    </div>
    <button @click="onClickEdit" class="edit_btn">{{$t('address_book.edit')}}</button>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from 'vue-property-decorator'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret,faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ExistedAddrBook } from "@/module/interface/AddrBook";

library.add(faUserSecret,faPlusSquare,faMinusSquare)
Vue.component('font-awesome-icon', FontAwesomeIcon)

@Component
export default class AddrBookCell extends Vue {
  @Prop() private addrInfo!: ExistedAddrBook;
  private onEditClick: boolean = false;

  mounted () {
    // console.log("Qty:",this.product.qty)
  }

  onClickEdit() {
    this.onEditClick = true;
    this.$emit('onClickModifyAddress', this.addrInfo)
  }

  onCardClick(){
     var that = this
    setTimeout(function() {
      if(that.onEditClick){
        that.onEditClick = false;
        return;
      }
      that.$emit('onCellClicked', that.addrInfo)
    }, 150);



  }
}

</script>

<style scoped src="@/common/styles/addr-book-cell.css">
</style>
