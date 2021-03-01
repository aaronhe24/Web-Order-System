<template>
  <div class="addr_book_view">
    <h4 class="addr_book_container title p-3">{{$t('address_book.my_address')}}</h4>

    <NoDataView style="margin-top: 50px"
                :content="$t('common.no_results')"
                class="addr_book_container"
                v-if="addrBookList.length < 1"/>

    <div class="addr_book_wrap addr_book_container" v-show="!isShowMobileEdit">
      <addr-book-cell v-for="(addrInfo, idx) in addrBookList"
                    :addrInfo="addrInfo"
                    :key="idx"
                    v-on:onClickModifyAddress="onClickModifyAddress($event)"
                    @onCellClicked = "onAddressCellClick"
                    class="m-3">
      </addr-book-cell>
      <addr-book-add-btn v-on:onClickAddAddress="onClickAddAddress"></addr-book-add-btn>
    </div>
    <edit-pop-up
      id="editPopUp"
      :title='this.title'
      :addrInfo="this.modifiedAddrInfo"
      :isNewAddr="this.isNewAddr"
      v-on:onClickRemove="onClickRemove($event)"
      v-on:onClickSave="onClickModalSave($event)"
      v-on:onClickCancel="onClickModalCancel"
      class="edit_popup"
    >
    </edit-pop-up>
    <edit-pop-up-mobile
      style="margin-top: 100px"
      :title='this.title'
      :isShowMobileEdit="isShowMobileEdit"
      :addrInfo="this.modifiedAddrInfo"
      :isNewAddr="this.isNewAddr"
      v-on:onClickRemove="onClickRemove($event)"
      v-on:onClickSave="onClickModalSave($event)"
      v-on:onClickCancel="onClickModalCancel"
    ></edit-pop-up-mobile>

    <MaskLoading :isShow="isShowLoading"/>

    <AlertModal id="address-alert"
                :okOnly="true"
                :title="$t('common.alert')"
                :content="alertContent"
                v-on:onPressOK="$root.$emit('bv::hide::modal', 'address-alert')"/>

  </div>

</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator'
import AddrBookCell from "@/components/addrBook/AddrBookCell";
import {AddrBookLogic} from "@/logic/addrBookLogic/AddrBookLogic";
import {AddrBook, ExistedAddrBook, getNewExistedAddrBook} from "@/module/interface/AddrBook";
import EditPopUp from "@/components/addrBook/EditPopUp";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import {Contact} from "@/module/interface/Contact";
import EditPopUpMobile from "@/components/addrBook/EditPopUpMobile";
import AddrBookAddBtn from "@/components/addrBook/AddrBookAddBtn.vue";
import MaskLoading from "@/components/baseComponents/MaskLoading.vue";
import NoDataView from "@/components/baseComponents/NoDataView.vue";
import {AddressComplete} from "@/logic/addressCompleteLogic/AddressComplete";
import AlertModal from "@/components/baseComponents/AlertModal.vue";
import { AppHelpers } from '@/common/AppHelpers';

@Component({
  components: {
    AlertModal,
    AddrBookAddBtn,
    EditPopUp,
    AddrBookCell,
    EditPopUpMobile,
    MaskLoading,
    NoDataView
  }
})
export default class AddrBookView extends Vue {
  private addrBookLogic = AddrBookLogic.getInstance();
  private addrBookList: ExistedAddrBook[] = [];
  private title: string = '';
  private onClickModalSave = this.addNewAddr;
  private modifiedAddrInfo: ExistedAddrBook = getNewExistedAddrBook();
  private isNewAddr: boolean = false;
  private onClickRemove = this.delAddr;
  private settings: GlobalSettingPreference = GlobalSettingPreference.getInstance();
  private isShowMobileEdit: boolean = false;
  private alertContent: string = this.$t('address_book.invalid_address').toString()
  private isShowLoading =  false
  //@ts-ignore
  private enableSelect: number = parseInt(this.$route.query.enableSelect) ?? 0;

  mounted () {
    window.scrollTo(0, 0);
    this.isShowLoading = true
    this.fetchAddrBookList();
  }

  async fetchAddrBookList() {
    try {
      let rs = await this.addrBookLogic.fetchAddrBook();
      let h = AppHelpers.getInstance()
      if(!h.isLogin(rs)){
        h.goToLogin(this)
        return ;
      }
      this.addrBookList = this.addrBookLogic.getAddrBook();
      this.isShowLoading = false
    }catch (e) {
      console.log(e)
    }
  }

  showAlertBox(isShow: boolean){
    if(!isShow){
      return
    }
    this.$root.$emit('bv::show::modal', 'address-alert')
  }

  async addNewAddr(addrBook: AddrBook) {
    let isAddressValid = await this.validateAddress(addrBook.address)
    if (!isAddressValid) {
      this.showAlertBox(true)
      return;
    } else {
      this.addrBookLogic.createAddrBook(addrBook).then(() => {
        this.fetchAddrBookList();
      })
      this.$bvModal.hide("editPopUp");
      this.isShowMobileEdit = false;
    }
  }

  async modifyAddr(addrBook: ExistedAddrBook) {
    let isAddressValid = await this.validateAddress(addrBook.address)
    if (!isAddressValid) {
      this.showAlertBox(true)
      return;
    } else {
      this.addrBookLogic.updateAddrBook(addrBook).then(() => {
        this.fetchAddrBookList();
      })
      this.$bvModal.hide("editPopUp");
      this.isShowMobileEdit = false;
    }
  }

  delAddr(id: number) {
    this.addrBookLogic.deleteAddrBook(id).then(()=> {
      this.fetchAddrBookList();
    })
    this.$bvModal.hide("editPopUp");
    this.isShowMobileEdit = false;
  }

  onClickModalCancel() {
    this.$bvModal.hide("editPopUp");
    this.isShowMobileEdit = false;
  }

  onClickModifyAddress(addrInfo: ExistedAddrBook) {
    this.title = this.$t('address_book.modify_address').toString();
    this.modifiedAddrInfo = addrInfo;
    this.isNewAddr = false;
    this.onClickModalSave = this.modifyAddr;
    (window.screen.width > 375)?
      this.$bvModal.show("editPopUp") :
      this.isShowMobileEdit = true;
  }

  onClickAddAddress() {
    this.title = this.$t('address_book.add_address').toString();
    this.modifiedAddrInfo = getNewExistedAddrBook();
    this.isNewAddr = true;
    this.onClickModalSave = this.addNewAddr;
    (window.screen.width > 375)?
      this.$bvModal.show("editPopUp") :
      this.isShowMobileEdit = true;
  }

  onAddressCellClick(address: AddrBook){
    if(this.enableSelect !==1){
      return;
    }
    if(!this.validateAddress(address.address)){
      this.showAlertBox(true)
      return;
    }
    let contact = new Contact();
    contact.name = address.name;
    contact.addr = address.address;
    contact.tel = address.tel
    GlobalSettingPreference.getInstance().getUser().address = address.address
    this.settings.setContact(contact);
    this.goToPaymentView()
  }

  goToPaymentView(){
    this.$router.replace('payment')
  }

  async validateAddress(addr: string){
    try{
      let result = await AddressComplete.getInstance().checkAddressValid(addr)
      return parseInt(result.city_id) > 0;
    } catch (e) {
      return false
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
