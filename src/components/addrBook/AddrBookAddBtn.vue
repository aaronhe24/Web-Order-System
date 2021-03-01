<template>
  <div class="addr_book_cell">
    <button
              class="addr_add_btn"
              @click="onClick"
    >
      <b-icon-plus class="plus_icon"></b-icon-plus>{{$t('address_book.add_address')}}
    </button>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret,faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret,faPlusSquare,faMinusSquare)
Vue.component('font-awesome-icon', FontAwesomeIcon)

@Component
export default class AddrBookAddBtn extends Vue {

  mounted () {}

  onClick() {
    this.$emit('onClickAddAddress');
  }
}

</script>

<style scoped src="@/common/styles/addr-book-cell.css">
</style>
