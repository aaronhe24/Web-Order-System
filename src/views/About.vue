<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div id="info">
      <h1>Bitcoin Price Index</h1>
      Precision: <input v-model="precision" type="text">
      <div v-for="currency in info.bpi" v-bind:key="currency.code" style="margin: 30px"
           class="currency">
        {{ currency.description ? currency.description : null}}:
        <span class="lighten">
            <span v-html="currency.symbol"></span>{{(currency.rate_float ? currency.rate_float : null) | toFixedX(precision)}}
          </span>
      </div>
      <p>First case up: {{content | firstCaseUp}}</p>
      <input v-model="content" type="text">
      <h2>{{today | formatDate}}</h2>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import axios from 'axios'
  import {firstCaseUp,toFixedX,formatDate} from '@/common/filters'

  @Component
  export default class About extends Vue {

    private info = null
    private content = 'ab'
    private today = new Date()
    private precision = 2

    mounted () {
      axios
        .get('https://api.coindesk.com/v1/bpi/currentprice.json')
        .then(response => {
          this.info = response.data
        })
        .catch(error => console.log(error))
    }

  }
</script>

<style scoped>
  #info {
    background: #42b983;
    margin-top: 60px;
    margin-bottom: 60px;
    position: relative;
    height: 500px;
  }
</style>
