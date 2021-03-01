<template>
    <b-modal modal-class="alert-modal" :id="id" centered :title="title"
             @ok="$emit('onPressOK')" :ok-only="okOnly"
             :ok-title="$t('common.confirm')"
             :cancel-title="$t('common.cancel')"
             ok-variant="outline-danger"
             cancel-variant="outline-secondary">
      <p class="my-4">{{content}}</p>
    </b-modal>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class AlertModal extends Vue {

        @Prop() private title!:string
        @Prop() private content!:string
        @Prop() private id!:any
        @Prop() private okOnly!:boolean

        mounted() {

        }
    }
</script>

<style scoped>

  /deep/ .alert-modal {
    font-family: var(--regular-font);
  }

</style>
