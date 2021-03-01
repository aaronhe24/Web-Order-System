<template>
  <div class="input-container">
    <img src="../../assets/icon_search@2x.png" id="input_img">
    <input type="text" v-model="inputValue" :placeholder="placeHolder" @change="onChange(inputValue)">
    <button class="input-btn" @click="submitInput(inputValue)">Go</button>
  </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class SearchBar extends Vue {
        @Prop()
        @Prop() private placeHolder!:string
        private inputValue:string = ""
        mounted() {

        }

        submitInput(input:string){
          this.$emit('submitSearch',input)
        }

        onChange(input:string){
          this.$emit('change',input)
        }

        init(input:string){
          this.inputValue = input
        } 
    }
</script>

<style scoped>

  @media screen and (max-width: 375px){
    #input_img {
      width: 20px;
      height: 20px;
      bottom: 10px;
      left: 10px;
    }

    .input-btn {
      font-size: 12px;
      bottom:5px;
      right:6px;
      width:40px;
      height:30px;
      border-radius: 15px;
      text-align: center;
    }

    input {
      padding-left: 35px;
      border-radius: 20px;
      height: 40px;
    }
  }

  @media screen and (min-width: 376px){
    #input_img {
      bottom:18px;
      left:20px;
    }
    .input-btn {
      font-size: 16px;
      bottom:10px;
      right:10px;
      width:80px;
      height:40px;
      border-radius: 20px;
    }
    input {
      padding-left: 60px;
      border-radius: 30px;
      height: 60px;
    }
  }

  input:focus,button:focus{
    outline: none;
  }

  input {
    border: 1px solid lightgray;
    width: 100%;
    padding-right: 100px;
    margin-top: 50px;
  }

  #input_img {
    position:absolute;
    cursor: pointer;
    width: 22px;
  }

  .input-btn {
    position:absolute;
    border: none;
    background-color: var(--theme-red);
    color: white;
  }

</style>
