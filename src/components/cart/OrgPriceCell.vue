<template>
  <div class="org-price-container">
    <base-line class="slash" :color="color"/>
    <div class="checkout-text" :style=" color ? 'color:'+ color + ';' :''" >${{price}}</div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BaseLine from '@/components/baseComponents/BaseLine.vue';
  @Component({
    components: {BaseLine}
  })
    export default class OrgPriceCell extends Vue {
        @Prop() private price!: number
        @Prop() private color!: string;
        @Prop() private fontSize!: string;

        @Watch('price')watchPrice(value: number){
          this.price = value;
        }

        mounted() {

        }
    }
</script>

<style scoped>
  .slash{
    margin-bottom: -9px;
    background-color: var(--dark-gray);
  }
  .org-price-container{
    display: flex;
    flex-direction: column;
    margin-right: 10px;
  }

  .checkout-text {
    font-size: 12px;
  }

</style>
