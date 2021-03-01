<template>
  <label class="option-cell">
    <div class="input-cell">
      <div class="input-border"/>
      <input :id="index" type="radio" :name="index" @click="onChecked" :checked ="isChecked"/>
    </div>
    <img v-if="imgSrc"
         :src="src"
         style="margin-left: 10px;width: 15px; height: 15px;justify-self: center" alt="">
    <div :class="enableTextBold ? 'desc-bold' : 'desc' ">{{this.des}}</div>
<!--    <div class="desc-bold">{{this.des}}</div>-->
  </label>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  //图片暂时不能用
  @Component
  export default class CircleCheckBox extends Vue {
    @Prop() private des!: string;
    @Prop() private imgSrc!: string
    @Prop() private index!: any;
    private isShowBorder =true
    private src = require(`@/assets/payment/icon_credit_card@2x.png`)
    @Prop() private isChecked!:boolean;
    @Prop() private enableTextBold!: boolean;

    mounted() {
    }

    onChecked() {
      this.$emit("onChecked", this.index)
    }


  }
</script>

<style scoped>
  .payment-option-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-text {
    color: var(--dark-black);
    font-size: 14px;
  }

  .option-cell {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: center;
    align-items: center;
  }

  /*input[type=checkbox] {*/
  /*  visibility: hidden;*/
  /*}*/


  /*#this.index + label {*/
  /*  width: 24px;*/
  /*  height: 24px;*/
  /*  background: white;*/
  /*  margin-top: 4px;*/
  /*  margin-left: -10px;*/
  /*  border-radius: 50px;*/
  /*  border: 0.5px solid var(--light-gray);*/
  /*}*/

  /*#this.index  + label::before {*/
  /*  display: block;*/
  /*  content: "\2713";*/
  /*  text-align: center;*/
  /*  font-size: 16px;*/
  /*  color: white;*/
  /*  background: var(--theme-red);*/
  /*  border-radius: 50px;*/
  /*}*/

  input[type=radio] {
    width: 24px;
    height: 24px;
    visibility: hidden;
  }

  input[type=radio]:after {
    position: absolute;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50px;
    border: 0.5px solid var(--light-gray);
    visibility: visible;
  }

  input[type=radio]:checked:after {
    position: absolute;
    display: block;
    content: "\2713";
    text-align: center;
    font-size: 16px;
    color: white;
    background: var(--theme-red);
    border-radius: 50px;
  }

  .input-border {
    margin-top: 4px;
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50px;
    background-color: white;
    border: 0.5px solid var(--light-gray);
    left: 0px;
    top: 0px;
    /*z-index: -1;*/

  }

  .desc{
    margin-left: 20px;
    font-size: 16px;
  }

  .desc-bold{
    margin-left: 20px;
    font-size: 16px;
    font-weight: bold;
  }
  .input-cell {
    position: relative;
    padding-top: 4px;
  }
</style>
