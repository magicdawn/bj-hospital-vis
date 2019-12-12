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

      <MglSource type="geojson" :data="geojson">
        <MglLayer v-bind="hospitalLayer" />
      </MglSource>
    </MglMap>
  </div>
</template>

<script>
import request from '../../../request.js'
// import {preventObserve} from '@magicdawn/x/vue'

export default {
  data() {
    return {
      center: [116.42610785602722, 39.91191408461194],
      zoom: 12,
      mapStyle: 'mapbox://styles/mapbox/light-v9',

      list: [],
    }
  },

  computed: {
    geojson() {
      const ret = {
        type: 'FeatureCollection',
        features: this.list.map(item => {
          const {code, name, lng, lat, rank, category} = item
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: {
              code,
              name,
              rank,
              category,
            },
          }
        }),
      }

      return ret
    },

    hospitalLayer() {
      return {
        type: 'circle',
        paint: {
          'circle-color': '#ff0000',
        },
        layout: {},
      }
    },
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      const json = await request.get('/data/hospital-with-geo.json')
      this.list = json.map(row => {
        const [code, name, lng, lat, rank, category] = row
        return {code, name, lng, lat, rank, category}
      })
    },
  },
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
