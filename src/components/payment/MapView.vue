<template>
  <GmapMap
    class="map"
    :center="{lat:markers[0].position.lat, lng:markers[0].position.lng}"
    :zoom="zoom"
    map-type-id="terrain"
  >
    <GmapMarker
      :key="idx"
      v-for="(m, idx) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=position"
    />
  </GmapMap>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
    import {MapMarker} from "@/module/interface/MapMarker";

    @Component
    export default class MapView extends Vue {
        @Prop() private zoom!: number;
        @Prop() private markers!: MapMarker[];

        @Watch('markers')watchMarkers(newValue: MapMarker[]){
          this.markers = newValue;
        }

        mounted() {
        }
    }
</script>

<style scoped>
.map{
  height: 100%;
  width: 100%;
}
</style>
