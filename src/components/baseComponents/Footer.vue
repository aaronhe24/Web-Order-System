<template>
  <div>
    <b-jumbotron id="footer-info" fluid>
      <h1 style="font-size: 36px; text-align: left">Food ordering has never been this easy!</h1>
      <div style="display: flex; flex-wrap: wrap; text-align: left">
        <p>Join our food delivery platform, over 1500+ restaurant partnership in 18 different cities across Canada.
          To order food on your door step, in few quick steps!
          <br><br>
          <a href="https://play.google.com/store/apps/details?id=com.foodhwy.foodhwy" target="_blank">
            <img src="../../assets/HomeIcons/icon_google_black@2x.png" class="icon" alt="">
          </a>
          <a href="https://apps.apple.com/ca/app/foodhwy-%E9%A3%9F%E9%80%9F%E5%A4%96%E5%8D%96/id1063806270" target="_blank">
            <img src="../../assets/HomeIcons/icon_apple_black@2x.png" class="icon" alt="">
          </a>
        </p>
<!--        <div style="flex: 30%">-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a><br>-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a><br>-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a>-->
<!--        </div>-->
<!--        <div style="flex: 30%">-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a><br>-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a><br>-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a>-->
<!--        </div>-->
<!--        <div style="flex: 30%">-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a><br>-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a><br>-->
<!--          <a href="www.foodhwy.com">Facedrive food</a><br>-->
<!--          <a href="www.foodhwy.com">About Us</a>-->
<!--        </div>-->
      </div>
    </b-jumbotron>

    <LightFooter/>

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import LightFooter from "@/components/baseComponents/LightFooter.vue";

  @Component({
    components: {
      LightFooter
    }
  })
  export default class Footer extends Vue {

  }
</script>

<style scoped>
  @import '../../common/globalStyle.css';



  #footer-info {
    margin: 200px auto auto auto;
    background-color: white;
    border-top: 1px solid lightgrey;
    font-family: var(--light-font);
  }

  #footer-info h1 {
    font-family: var(--regular-font);
  }

  #footer-info p {
    color: var(--gray);
  }

  #footer-info img {
    margin-right: 10px;
    float: right;
  }

  .icon {
    width: 150px;
    margin: 10px;
  }

</style>
