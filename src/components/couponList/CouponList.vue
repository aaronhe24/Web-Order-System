<template>
  <img :src="img">
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

@Component
export default class CouponList extends Vue {
  @Prop() private img: any;

  mounted() {

  }

  onClick(): void {
    this.$emit('')
  }
}
</script>

<style scoped>

</style>
