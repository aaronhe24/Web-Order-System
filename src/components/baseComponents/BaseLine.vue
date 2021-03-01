<template>
  <div class="base-line-container" >
    <div class="base-line" :style="color ? ' background-color:' + color : ''"/>

  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class BaseLine extends Vue {
        @Prop() private color!: string

        mounted() {
        }
    }
</script>

<style scoped>
  .base-line-container{
    display: flex;
    flex-direction: row;
  }
  .base-line{
    flex: 100%;
    height: 0.5px;
    background-color: var(--border-color);
  }
</style>
