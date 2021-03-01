<template>
  <b-jumbotron fluid id="footer">
    <span><img style="width: 30px; height: 20px; margin-right: 10px" src="../../assets/icon_facedrive_foods@2x.png" alt="">  © 2020 Facedrive Foods Inc.
    </span>
    <span style="margin-left: 50px">{{$t('common.customer_service')}}</span>
  </b-jumbotron>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class LightFooter extends Vue {
        @Prop()

        mounted() {

        }
    }
</script>

<style scoped>
  #footer {
    font-family: var(--light-font);
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    text-align: left;
    background-color: #F5F7FA;
    height: 80px;
  }
</style>
