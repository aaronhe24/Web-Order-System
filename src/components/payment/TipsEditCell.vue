<template>
    <div class="container">
      <div class="title">{{$t("payment.tipsEditTitle")}}</div>
      <label for="input-tips">
<!--        <input id="input-tips" :class="isShowWarning ? 'input-text-error': 'input-text' "-->
<!--               type="text" name="numb" maxlength="5" v-model="tips" step="0.01" autofocus/>-->
        <input id="input-tips" :class="isShowWarning ? 'input-text-error': 'input-text' "
               type="text" name="numb" v-model="tips" autofocus/>
        <div v-if="isShowWarning" style="font-size: 12px; color: var(--theme-red); text-align: center; margin-bottom: 10px">Invalid amount</div>

      </label>
      <div class="button-cell">
        <b-button id="confirmBtn" @click="onConfirm">{{$t("global.confirm")}}</b-button>
        <b-button id="cancelBtn" @click="onCancel">{{$t("global.cancel")}}</b-button>
      </div>
    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

    @Component
    export default class TipsEditCell extends Vue {
        private tips: string = '';
        private isShowWarning = false;
        mounted() {

        }

        @Watch("tips")watchTips(newValue:string){
          if(!newValue){
            return;
          }
          this.isShowWarning = false
          this.tips = newValue
          // this.tips = this.sliceAlphabet(newValue);
          // this.tips = this.addDecimal(this.tips);
        }

        onConfirm(){
          if(!this.tips || Number(this.tips) < 0 || isNaN(Number(this.tips)) || Number(this.tips) > 100){
            this.isShowWarning = true
            return;
          }
          this.$emit("onConfirm", this.tips)
        }

        onCancel(){
          this.$emit("onCancel")
        }

        // addDecimal(value: string){
        //   let t = parseInt(value)
        //   return (t/100).toString()
        //   // if(value.includes(form)){
        //   //
        //   // }
        //   // value = value.replace('.','')
        //   // value = value.replace('0','')
        //   // if(value.length > 2){
        //   //   value = [value.slice(0,2),  "." , value.slice(2)].join('')
        //   // }else {
        //   //   value = ["0",".",value].join('')
        //   //   value = value ==="0." ? "" : value
        //   // }
        //   // return value;
        // }
        //
        // sliceAlphabet(value: string){
        //   return value.replace(/[^\d]/g,'')
        // }

    }

</script>

<style scoped>
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-weight: bold;
    color: var(--dark-black);
  }
  .input-text{
    outline: 0;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    margin:20px;
  }

  .input-text-error{
    outline: 0;
    border: 1px solid var(--theme-red);
    border-radius: 5px;
    margin:20px;
  }

  .button-cell{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  #confirmBtn{
    height: 40px;
    width: 80px;
    border-radius: 4px;
    border:0;
    background-color: var(--theme-red);
    color: white;

  }
  #cancelBtn{
    margin-left: 20px;
    height: 40px;
    width: 80px;
    border-radius: 4px;
    border:0;
    background-color: grey;
    color: white;
  }

  #confirmBtn.btn:focus, #cancelBtn.btn:focus {
    outline: 0;
    box-shadow: none !important;
    color: white;
  }

</style>
