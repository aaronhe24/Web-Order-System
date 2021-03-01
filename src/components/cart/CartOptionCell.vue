<template>
  <div>
    <b-card
      tag="article"
      style="max-width: 20rem;margin: 10px 20px 10px 20px; border: 0px"
      class="mb-2">

      <b-card-text>
        {{option.optionToString()}}:
      </b-card-text>

    </b-card>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import {Option} from "@/module/interface/Option";
    import {Item} from "@/module/interface/Item";

    @Component
    export default class CartOptionCell extends Vue {
        @Prop() private option!: Option;
                private itemList: Item[] =[]

        mounted() {
             this.itemList = this.option.items;
        }
    }
</script>

<style scoped>

</style>
