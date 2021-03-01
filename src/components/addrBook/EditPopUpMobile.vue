<template>
  <div v-show="isShowMobileEdit" class="edit_popup_mobile">
    <div class="popup_header">
      <h4 class="title">{{$t('address_book.my_address')}}</h4>
      <button class="close_btn" @click="onClickClose"><b-icon-x-circle></b-icon-x-circle></button>
    </div>
    <b-form @submit.prevent="onClickSave" class="popup_form">
      <p>{{this.title}}</p>
      <b-form-group
        :label="$t('address_book.name')"
        label-for="name"
      >
        <b-form-input
          id="name"
          trim
          required
          v-model="name"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :label="$t('address_book.tel')"
        label-for="tel"
      >
        <b-form-input
          id="tel"
          trim
          required
          v-model="tel"
        ></b-form-input>
      </b-form-group>

      <b-button
        class="rm"
        @click="onClickRemove"
        v-if="!isNewAddr"
      >Remove</b-button>

      <b-form-group
        :label="$t('address_book.address')"
        label-for="address"
      >
        <address-complete-input
          id="address"
          :place-holder="address"
          v-on:updateAddress="onUpdateAddress($event)"
        />
      </b-form-group>

      <b-form-group
        :label="$t('address_book.unit') + ' (' + $t('address_book.optional') + ')'"
        label-for="unit"
      >
        <b-form-input
          id="unit"
          trim
          v-model="unit"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :label="$t('address_book.buzz_code') + ' (' + $t('address_book.optional') + ')'"
        label-for="buzz"
      >
        <b-form-input
          id="buzz"
          trim
          v-model="buzz_code"
        ></b-form-input>
      </b-form-group>
      <b-button class="save_btn" type="submit">{{$t('address_book.save')}}</b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import ProductDetailCell from "@/components/shop/ProductDetailCell.vue";
import {AddrBook, ExistedAddrBook} from "@/module/interface/AddrBook";
import AddressCompleteInput from "@/components/baseComponents/AddressCompleteInput.vue";

@Component({
  components: {ProductDetailCell,AddressCompleteInput},
})

export default class EditPopUpMobile extends Vue {

  @Prop() private title!: string;
  @Prop() private addrInfo!: ExistedAddrBook;
  @Prop() private isNewAddr!: boolean;
  @Prop() private isShowMobileEdit!: boolean;
  private name: string = '';
  private tel: string = '';
  private address: string = '';
  private unit: string = '';
  private buzz_code: string = '';
  @Watch('addrInfo')
  onPropertyChanged(value: ExistedAddrBook, oldValue: ExistedAddrBook) {
    this.name = value.name;
    this.tel = value.tel;
    this.address = value.address;
    this.unit = value.unit;
    this.buzz_code = value.buzz_code;
  }

  mounted() {}

  onClickSave() {
    const addrDetail = this.isNewAddr ?
      {
        is_default: 0,
        name: this.name,
        tel: this.tel,
        address: this.address,
        unit: this.unit,
        buzz_code: this.buzz_code
      } as AddrBook :
      {
        id: this.addrInfo.id,
        cid: this.addrInfo.cid,
        is_default: this.addrInfo.is_default,
        name: this.name,
        tel: this.tel,
        address: this.address,
        unit: this.unit,
        buzz_code: this.buzz_code
      } as ExistedAddrBook

    this.$emit('onClickSave', addrDetail);
  }

  onClickRemove() {
    this.$emit('onClickRemove', this.addrInfo.id);
  }

  onClickClose() {
    this.$emit('onClickCancel');
  }

  onUpdateAddress(address: string) {
    this.address = address;
  }

}
</script>

<style scoped>
.rm {
  color: var(--theme-red);
  font-size: 12px;
  margin: 10px 0;
  border-width: 0;
  background-color: white;
  padding: 0;
  outline: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.edit_popup_mobile {
  background-color: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: 60px;
  padding: 0 5%;
  overflow-y: auto;
}

.close_btn {
  border: none;
  background-color: white;
}

.popup_header {
  display: flex;
  justify-content: space-between;
}

.popup_form {
  text-align: left;
}

.save_btn {
  margin-top: 15px;
  margin-bottom: 30px;
  background-color: var(--theme-red);
  color: white;
  width: 100%;
  border: none;
  border-radius: 5px;
  height: 45px;
}

/deep/ .input-box {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
