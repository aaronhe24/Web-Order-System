<template>
  <div style="display: flex;flex-direction: column">
    <div class="cell_body ">
      <div class="cell_left">
        {{label}}
      </div>
      <div class="cell_right">
        ${{price}}
      </div>
    </div>
    <base-line/>
  </div>

</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import BaseLine from "@/components/baseComponents/BaseLine.vue";
@Component({
  components: {BaseLine}
})
export default class OrderDetail extends Vue {

  @Prop() private label!: string;
  @Prop() private price!: string;

  mounted() {

  }

}
</script>

<style scoped>
  .cell_body {
    display: flex;
    padding: 10px 0;
  }

  .gray_bot_border {
    border-bottom: 0.5px solid;
    border-bottom-color: var(--border-color);
  }

  .cell_left {
    flex: 75%;
    max-width: 75%;
  }

  .cell_right {
    flex: 25%;
    max-width: 25%;
    text-align: right;
  }

  p {
    margin-bottom: 3px;
  }
</style>
