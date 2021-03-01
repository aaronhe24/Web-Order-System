<template>
  <div class="log_wrap">
    <p class="title">{{title}}</p>
    <ul v-for="(log, idx) in logs">{{log}}</ul>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
@Component({})
export default class LogContainer extends Vue {
  @Prop() private title!: string;
  @Prop() private logs!: [];
}
</script>


<style scoped>
  .log_wrap {
    text-align: left;
    padding: 20px 15px;
  }

  .log_wrap > ul {
    padding: 0;
    color: #999999;
    font-size: 12px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
</style>
