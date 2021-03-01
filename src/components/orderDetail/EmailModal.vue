<template>

  <b-modal modal-class="email-modal" :id="id" centered :title="title" hide-footer>
    <p class="my-2">{{content}}</p>
    <div style="display: flex; flex-direction: row">
      <b-form-input type="email" v-model="email" :state="emailStatus"></b-form-input>
      <b-button class="mx-3" style="width: 70px"
                type="email"
                variant="outline-danger"
                @click="onClickConfirm(email)">
        {{$t('order.send_label')}}
      </b-button>
    </div>
    <p v-if="emailStatus === false" class="my-2" style="color: var(--theme-red)">{{$t('common.invalid_input')}}</p>
    <p v-if="resultStatus === 1" class="my-2" style="color: darkseagreen">{{$t('order.send_success')}}</p>
    <p v-if="resultStatus === 0" class="my-2" style="color: var(--theme-red)">{{$t('order.wrong_email')}}</p>
  </b-modal>

</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

    @Component
    export default class EmailModal extends Vue {
      @Prop() private title!:string
      @Prop() private content!:string
      @Prop() private id!:any
      @Prop() private result!:any
      private email:string = ""
      private emailStatus:any = null
      private resultStatus = 9

      @Watch('email')checkEmailStatus(newValue:string, oldValue:string){
          this.resultStatus = 9
          this.emailStatus = this.validateEmail(newValue)
      }

      @Watch('result')checkResultStatus(newValue:number, oldValue:number){
          if(newValue === 1 || newValue === 0){
            this.resultStatus = newValue
          }
      }

      mounted() {

      }

      onClickConfirm(email:string){
          if(this.emailStatus){
            // alert("good")
            this.$emit('sendReceiptEmail',email)
          }else  {
            this.emailStatus = false
          }
      }

      validateEmail(email:string) {
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
      }

    }
</script>

<style scoped>

  /deep/ .email-modal {
    font-family: var(--regular-font);
  }

</style>
