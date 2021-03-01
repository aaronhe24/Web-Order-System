<template>
    <div class="card" @click="goToShopList(cityName,cityId.toString())">
      <img :src=cityImg alt="" style="object-fit: cover">
      <img id="mask" src="../../assets/HomeIcons/city_card_mask.png" alt="">
      <span>{{cityName}}</span>
    </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from 'vue-property-decorator'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faUserSecret,faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { GlobalSettingPreference } from "@/GlobalSettingPreference";

  library.add(faUserSecret,faPlusSquare,faMinusSquare)
  Vue.component('font-awesome-icon', FontAwesomeIcon)

  @Component
  export default class CityCardCell extends Vue {
    @Prop() private cityName!: string;
    @Prop() private cityImg!: string;
    @Prop() private cityId!: number;

    goToShopList(name:string,id:string){
      this.$emit('setCityInfo',
        {name:name,id:id}
      )
      this.$router.push(
        {
          name: "RestaurantListView",
          params: {
            id: id,
            name: name,
          },
          query:{
            cityId:id
          }
        })
    }


  }


</script>

<style scoped>

  @media screen and (max-width: 375px){
    .card {
      flex: 47%;
      max-width: 47%;
      height: 122px;
      margin: 5px;
    }
    .card span {
      font-size: 14px;
      right: 10px;
    }
  }

  @media screen and (min-width: 376px) and (max-width: 991px){
    .card {
      flex: 47%;
      max-width: 47%;
      height: 130px;
      margin: 5px;
    }
    .card span {
      font-size: 15px;
      right: 6px;
    }
  }

  @media screen and (min-width: 992px) {
    .card {
      flex: 22%;
      max-width: 22%;
      height: 168px;
      margin: 13px;
    }
    .card span {
      font-size: 20px;
      right: 10px;
    }
  }

  .card {
    cursor: pointer;
  }

  .card img {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  #mask {
    position: absolute;
    bottom: -1px;
    height: 40%;
  }

  .card span {
    position: absolute;
    bottom: 6px;
    z-index: 1;
    color: white;
    font-family: var(--regular-font);
  }

</style>
