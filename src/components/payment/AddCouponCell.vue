<template>
  <div class="container">
    <div class="title">Enter coupon Code</div>
    <div class="text-error">{{errorMessage}}</div>
    <label for="input-code">
      <input id="input-code" :class="isCouponValidate ? 'input-text' : 'input-text-error'"
             type="text" name="numb" v-model="code" autofocus />
    </label>
    <p class="err_text" v-show="!isCouponValidate">{{addCouponModelErr}}</p>
    <div class="button-cell">
      <b-button id="confirmBtn" @click="onConfirm">{{$t("global.confirm")}}</b-button>
      <b-button id="cancelBtn" @click="onCancel">{{$t("global.cancel")}}</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

@Component
export default class AddCouponCell extends Vue {
  private code: string = '';
  @Prop() private isCouponValidate!: boolean;
  @Prop() private addCouponModelErr!: string;
  @Prop() private errorMessage!: string;

  @Watch('isCouponValidate')
  onPropertyChanged(value: boolean) {
    this.isCouponValidate = value;
  }

  @Watch("errorMessage")watchE(newValue: string){
    this.errorMessage = newValue
  }

  mounted() {

  }

  onConfirm(){
    if(!this.code){
      // this.isCouponValidate = true
      return;
    }
    this.$emit("onCouponConfirm", this.code)
  }

  onCancel(){
    this.$emit("onCouponCancel")
  }
}

</script>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.err_text {
  color: var(--theme-red);
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

  .text-error{
    align-self: center;
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
    color: var(--theme-red);
  }

</style>
