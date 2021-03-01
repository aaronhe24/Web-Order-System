<template>
  <div style="position: relative">
  <input  class="input-box"
          type="text" v-model="inputAddress" :placeholder="placeHolder">
  <!--            地址补全弹框-->
    <div v-if="inputAddressCompletion" class="address-container" v-click-outside="onClickOutside">
      <div class="address-label" v-for="address in inputAddressCompletion"
           @click="setSelectedAddress(address.description)">
        {{address.description}}
      </div>
    </div>
  </div>

</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {AddressComplete} from "@/logic/addressCompleteLogic/AddressComplete";
  import {AddressCompleteInfo} from "@/module/interface/AddressCompleteInfo";
  import {GlobalSettingPreference} from "@/GlobalSettingPreference";

    @Component
    export default class AddressCompleteInput extends Vue {

      @Prop() private placeHolder!:string
      @Prop() private locatorAddress!:string
      private inputAddress:string = ""
      private selectedAddress = false
      private addressInfo = AddressComplete.getInstance()
      private globalSettings = GlobalSettingPreference.getInstance()
      private inputAddressCompletion:AddressCompleteInfo[] = []

      @Watch('locatorAddress')checkLocatorStatus(newValue:string, oldValue:string){
        if(newValue){
          // console.log("NEWNEW",newValue)
          this.selectedAddress = true
          this.inputAddress = this.locatorAddress
          this.$emit('updateAddress',this.inputAddress)
        }
      }

      @Watch('inputAddress')checkInputStatus(newValue:string, oldValue:string){
          this.matchAutoCompleted(newValue)
          this.$emit('updateAddress',newValue)
          // console.log("n",newValue)
          // console.log("o",oldValue)

          if(newValue.length < oldValue.length)
          {this.selectedAddress = false}
      }

      //调用地址补全api
      matchAutoCompleted(input:string){
        this.addressInfo.fetchAddressComplete(input,JSON.stringify(this.globalSettings.getUserLatLng()))
        this.inputAddressCompletion = input && !this.selectedAddress? this.addressInfo.getCompletedAddress() : []
      }

      setSelectedAddress(input:string){
        this.selectedAddress = true
        this.inputAddress = input
        this.$emit('updateAddress',input)
      }

      onClickOutside (){
        this.inputAddressCompletion = []
      }

    }
</script>

<style scoped>

  .address-container {
    position: absolute;
    top: 55px;
    flex-direction: column;
    background-color: white;
    max-width: 400px;
    z-index: 1;
    box-shadow: 1px 1px 5px lightgray;
  }

  .address-label {
    font-size: 16px;
    background-color: white;
    margin: 30px;
  }

  .address-label:hover {
    background-color: var(--theme-red);
    color: white;
  }

  input:focus,button:focus{
    outline: none;
  }

</style>
