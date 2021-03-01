<template>
    <div class="no-data-container">
      <img class="no-data-img" src="../../assets/shop/no_data_img@2x.png" alt="">
      <h4 style="margin-top: 10px">{{content}}</h4>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class NoDataView extends Vue {
        @Prop() private content!:string

        mounted() {

        }
    }
</script>

<style scoped>

  .no-data-container {
    color: var(--light-gray);
    font-family: var(--regular-font);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    border: 1px solid var(--light-gray);
  }

  .no-data-img {
    width: 130px;
    height: 130px;
  }

</style>
