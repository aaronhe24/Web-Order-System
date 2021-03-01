<template>
    <div class="restaurant-card" @click="goToShopWithId(id,name)">

      <img class="thumbnail" :src="img ? img : require(`../../assets/shop/shop_default_img@2x.png`)" alt="">
      <p style="text-align: left;margin-top: 10px;font-size: 18px">{{name}}</p>
      <div class="shop-info-container">
      <div class="shop-info">
        <div style="display: flex">
          <div style="margin-right: 15px">{{$t('shop.min_spend')}}: ${{min}}</div>
          <div>{{$t('shop.cooking_time')}}: {{cookingTime}}min</div>
        </div>
        <div v-if="km < 50">
          {{km}}{{$t('shop.km')}}
        </div>
      </div>
      <div style="text-align: left">{{$t('shop.open_hours')}}: {{openTime}}</div>
      </div>
      <div class="tags-container">
<!--        <div class="tags" :style="{'background-color':item.color}" v-for="item in tags">-->
<!--          {{item.tag}}-->
<!--        </div>-->
        <div class="tags" v-for="item in tags">
          {{item.tag}}
        </div>
      </div>

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class RestaurantCardCell extends Vue {

      @Prop() private id!:number
      @Prop() private img!:string
      @Prop() private name!:string
      @Prop() private min!:number
      @Prop() private cookingTime!:number
      @Prop() private km!:number
      @Prop() private openTime!:string
      @Prop() private tags!:any[]

      mounted(){
      }

      goToShopWithId(shop_id:number,name:string){
        this.$router.push(
          {
            name: "ShopOrderView",
            params: {
              shopName:name,
              shopId: shop_id.toString(),
            },
            query:{
              shopId:shop_id.toString()
            }
          })
      }

    }

</script>

<style scoped>


  @media screen and (max-width: 991px) {
    .restaurant-card {
      flex: 100%;
      max-width: 100%;
      /*height: 330px;*/
      margin: 0px 5px 20px 5px;
      font-family: var(--regular-font);
    }
  }

  @media screen and (min-width: 992px) {
    .restaurant-card {
      flex: 30%;
      max-width: 30%;
      margin-right: 30px;
      margin-bottom: 20px;
      font-family: var(--regular-font);
    }
  }

    .restaurant-card {
      cursor: pointer;
    }

    .thumbnail {
      height: 216px;
      width: 100%;
      object-fit: cover;
    }

    .shop-info-container,.shop-info {
      color: var(--dark-gray);
      font-size: 12px;
      padding-bottom: 5px;
    }

    .shop-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .tags-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .tags {
      background-color: var(--light-gray);
      height: 16px;
      font-size: 10px;
      margin-right: 5px;
      margin-bottom: 5px;
      padding:0px 5px;
      color: var(--dark-gray);
    }


</style>
