<template lang="html">
  <div class="page-home">
    <MglMap
      class="map"
      :center.sync="center"
      :zoom.sync="zoom"
      :mapStyle="mapStyle"
      :attributionControl="false"
      @load="onMapLoad"
    >
      <!-- bottom right -->
      <MglNavigationControl position="bottom-right" />

      <MglPolygon
        v-if="currentPolygon"
        :geojson="currentPolygon"
        :border-color="'red'"
        :border-width="1"
        :fill-color="'green'"
        :fill-opacity="0.1"
      />

      <MglSource type="geojson" :data="geojson">
        <MglLayer
          v-bind="hospitalLayer"
          @mouseenter="hospitalLayerMouseenter"
          @mouseleave="hospitalLayerMouseleave"
        />
      </MglSource>

      <MglPopup v-if="currentItem" :lnglat="[currentItem.lng, currentItem.lat]" :show="true">
        {{ JSON.stringify(currentItem) }}
      </MglPopup>
    </MglMap>
  </div>
</template>

<script>
import _ from 'lodash'
import request from '../../../request.js'
import {preventObserve} from '@magicdawn/x/vue'
import Loading from '../../../util/Loading.vue'
import * as turf from '@turf/turf'

export default {
  data() {
    return {
      center: [116.42610785602722, 39.91191408461194],
      zoom: 12,
      mapStyle: 'mapbox://styles/mapbox/light-v9',

      list: [],
      currentItem: null,

      districtList: [],
      currentAdcode: '110000',
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
              ...item,
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

    currentPolygon() {
      const {currentAdcode, districtList} = this
      const item = _.find(districtList, {adcode: currentAdcode})
      return item && item.polygon
    },
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      Loading.show()
      try {
        await Promise.all([
          // apis
          this.initList(),
          this.initDistrict(),
          this.waitMapReady(),
        ])
      } finally {
        Loading.hide()
      }

      const b = turf.bbox(this.currentPolygon)
      this.map.fitBounds(b, {
        padding: {
          left: 50,
          bottom: 50,
          right: 0,
          top: 0,
        },
      })
    },

    async initDistrict() {
      const arr = await request.get('/data/district.json')

      for (let item of arr) {
        const {polyline} = item
        const polygon = {
          type: 'Polygon',
          coordinates: [
            [
              ...polyline.split(';').map(p => {
                let [lng, lat] = p.split(',')
                ;[lng, lat] = [lng, lat].map(Number)
                return [lng, lat]
              }),
            ],
          ],
        }

        preventObserve(polygon)
        item.polygon = polygon
      }

      this.districtList = arr
    },

    async initList() {
      const json = await request.get('/data/hospital-with-geo.json')

      const list = json.map(row => {
        const [code, name, lng, lat, rank, category] = row
        return {code, name, lng, lat, rank, category}
      })

      preventObserve(list)
      this.list = list
    },

    onMapLoad({map, component}) {
      this.map = map
      this.mapReady = true
      this.$emit('map-ready')
    },
    async waitMapReady() {
      if (this.mapReady) return
      return new Promise(r => this.$once('map-ready', r))
    },

    hospitalLayerMouseenter(e) {
      const properties = _.get(e, 'features.0.properties')
      if (!properties) {
        this.currentItem = null
        return
      }
      this.currentItem = {...properties}
    },
    hospitalLayerMouseleave(e) {
      this.currentItem = null
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
