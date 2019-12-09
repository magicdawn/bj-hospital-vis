<template lang="html">
  <div class="page-home">
    <MglMap
      class="map"
      :center.sync="center"
      :zoom.sync="zoom"
      :mapStyle="mapStyle"
      :attributionControl="false"
    >
      <!-- bottom right -->
      <MglNavigationControl position="bottom-right" />
    </MglMap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: [116.42610785602722, 39.91191408461194],
      zoom: 12,
      mapStyle: 'mapbox://styles/mapbox/light-v9',
    }
  },

  computed: {},
}
</script>

<style lang="less" scoped>
.page-home {
  height: 100vh;

  .map {
    height: 100%;
  }

  /deep/ .mapboxgl-ctrl-logo {
    display: none !important;
  }
}
</style>
