<template>
  <div class="loading" v-if="isShow">
    <img :src="require(`../../assets/Loading/FD_fullscreen_loading_red_${index}@2x.png`)" alt="">
    <span>{{$t('common.loading')}}</span>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

  @Component
  export default class MaskLoading extends Vue {
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
    position: fixed;
    top: calc((100% - 200px)/2);
    left: calc((100% - 200px)/2);
    /*border: 1px solid var(--theme-red);*/
    background: rgba(230,230,230,0.6);
    /*opacity: 0.8;*/
    width: 200px;
    height: 200px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: var(--regular-font);
    z-index: 1;
  }

  .loading img {
    height: 100px;
  }

</style>

