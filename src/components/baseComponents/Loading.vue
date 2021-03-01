<template>
    <div class="loading" v-if="isShow">
        <img :src="require(`../../assets/Loading/FD_fullscreen_loading_red_${index}@2x.png`)" alt="">
        {{$t('common.loading')}}
    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

    @Component
    export default class Loading extends Vue {
        @Prop() private isShow!:boolean;

        private index:number = 0
        private imgPlayer:any

        mounted() {
            this.startImagePlayer()
        }

      @Watch('isShow')checkStatus(newValue:boolean,oldValue:boolean){
        if(!newValue){
          clearInterval(this.imgPlayer)
        }else{
          this.startImagePlayer()
        }
      }

      startImagePlayer(){
        this.imgPlayer = setInterval(()=>{
          if (this.index < 29){
            this.index += 1
          }else {
            this.index = 0
          }
        },30)
      }

    }
</script>

<style scoped>

    .loading {
      border: 1px solid lightgray;
      background: white;
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--regular-font);
    }

    .loading img {
      height: 50px;
    }

</style>
