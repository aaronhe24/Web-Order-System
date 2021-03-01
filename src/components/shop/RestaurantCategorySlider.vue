<template>

  <div style="position: relative">
    <div v-show="showRightBtn" class="right-btn nav-btn" @click="slideRight">
      >
      <!--      <img src="../../assets/icon_right_arrow.png" >-->
    </div>
    <div v-show="showLeftBtn" class="left-btn nav-btn" @click="slideLeft">
      <
      <!--      <img src="../../assets/icon_left_arrow.png">-->
    </div>
        <b-jumbotron fluid id="category-container" ref="container">
          <div class="category-item" :key="index"
               v-for="(category,index) in shopCategories">
              <img class="icon" :src="`${category.image}`" alt=""
                 :class="index === currentIndex ? 'active-category' : null"
                 @click="setSelectedCategory(category,index)">
              <p class="category-label"
                 :class="index === currentIndex ? 'active-label' : null">
                {{category.name}}</p>
          </div>
        </b-jumbotron>
  </div>


</template>

<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class RestaurantCategorySlider extends Vue {

      @Prop() private shopCategories:any
      private currentIndex = 0
      private showRightBtn = true
      private showLeftBtn = false

      setSelectedCategory(item:any,index:number){
          this.currentIndex = index
          this.$emit("setShopFilter",item)
      }

      slideRight() {
        let container = this.$refs.container as HTMLInputElement
        container.scrollLeft += 240
        this.showLeftBtn = true
        if(container.scrollLeft > 2000){
          this.showRightBtn = false
        }
      }

      slideLeft() {
        let container = this.$refs.container as HTMLInputElement
        container.scrollLeft -= 240
        this.showRightBtn = true
        if(container.scrollLeft <= 240){
          this.showLeftBtn = false
        }
      }

    }
</script>

<style scoped>

  @media screen and (max-width: 575px) {
    .category-label {
      font-size: 12px;
    }
    #category-container {
      overflow-x: auto;
      width: 92vw;
      height: 180px;
    }
    .category-item {
      height: 55px;
      width: 55px;
    }
    .nav-btn {
      border-radius: 10px;
      width: 20px;
      height: 20px;
      top: 41%;
    }
    .right-btn {
      right: -2%;
    }
    .left-btn {
      left: -2%;
    }
  }

  @media screen and (min-width: 576px) {
    .category-label {
      font-size: 14px;
    }
    #category-container {
      overflow-x: hidden;
      width: 95%;
      height: 300px;
    }
    .category-item {
      height: 100px;
      width: 100px;
    }
    .nav-btn {
      border-radius: 20px;
      width: 40px;
      height: 40px;
      top: 40%;
    }
    .right-btn {
      right: 3%;
    }
    .left-btn {
      left: -2%;
    }
  }

  .nav-btn {
    position: absolute;
    z-index: 1;
    cursor: pointer;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid lightgray;
    box-shadow: 0px 0px 5px lightgray;
  }

  .nav-btn:hover {
    background: var(--theme-red);
    color: white;
  }

  #category-container {
    scroll-behavior: smooth;
    white-space: nowrap;
    background: white;
    /*width: 95%;*/
    margin-top: 0px;
    margin-bottom: -50px;
  }

  .icon{
    width: 100%;
    height: 100%;
    border-radius: 50px;
    opacity: 0.7;
  }

  .icon{
    cursor: pointer;
  }

  .category-label {
    color: var(--dark-black);
    margin-top: 10px;
    text-align: center;
  }

  .category-item {
    display: inline-block;
    margin: 25px 10px 25px 10px;
  }

  .active-category {
    border: 5px solid var(--theme-red);
    opacity: 1;
  }

  .active-label {
    color: var(--theme-red);
  }

</style>
