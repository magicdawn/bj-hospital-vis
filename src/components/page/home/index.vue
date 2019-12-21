<template lang="html">
  <div class="page-home">
    <div class="map-wrapper">
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
          :border-color="'purple'"
          :border-width="1"
          :fill-color="'green'"
          :fill-paint="polygonFillPaint"
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

    <CollapsePanel class="left-panel" side="left" :gap="10" v-model="showLeftPanel">
      <h1 class="title">医院筛选</h1>

      <a-form-item label="名称搜索" :label-col="{span: 6}" :wrapper-col="{span: 14}">
        <a-input placeholder="input placeholder" />
      </a-form-item>

      <a-form :layout="'horizontal'">
        <a-form-item label="地区" :label-col="{span: 6}" :wrapper-col="{span: 14}">
          <a-select v-model="currentAdcode" @change="handleDistrictChange">
            <a-select-option v-for="item in districtList" :key="item.adcode" :value="item.adcode">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="评级" :label-col="{span: 6}" :wrapper-col="{span: 14}">
          <a-select v-model="currentRank">
            <a-select-option v-for="item in ALL_RANK" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="分类" :label-col="{span: 6}" :wrapper-col="{span: 14}">
          <a-select v-model="currentCategory">
            <a-select-option v-for="item in ALL_CATEGORY" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </CollapsePanel>
  </div>
</template>

<script>
import _ from 'lodash'
import request from '../../../request.js'
import {preventObserve} from '@magicdawn/x/vue'
import Loading from '../../../util/Loading.vue'
import * as turf from '@turf/turf'
import CollapsePanel from '../../panel/collapse-panel.vue'
import worker from '../../../worker/main.js'

const DEFAULT_AD_CODE = '110000'
const ALL = '全部'
const ALL_RANK = [ALL, '未评级', '三级', '二级', '一级']
const ALL_CATEGORY = [ALL, '对内', '对外综合', '对外中医', '对外专科', '社区卫生站', '村卫生室']

export default {
  components: {CollapsePanel},

  data() {
    return {
      ALL_RANK,
      ALL_CATEGORY,

      center: [116.42610785602722, 39.91191408461194],
      zoom: 12,
      mapStyle: 'mapbox://styles/mapbox/light-v9',
      currentItem: null,

      fulllist: [],
      currentList: [],

      districtList: [],
      polygonFillPaint: {
        'fill-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          //
          8,
          0.1,

          10,
          0.06,

          18,
          0.01,
        ],
      },

      showLeftPanel: true,

      /**
       * 搜索项
       */

      currentAdcode: DEFAULT_AD_CODE,
      currentRank: ALL,
      currentCategory: ALL,
    }
  },

  computed: {
    geojson() {
      const ret = {
        type: 'FeatureCollection',
        features: this.currentList.map(item => {
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
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            // zoom, ?px
            8,
            5,

            10,
            6,

            18,
            15,
          ],
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

  watch: {
    async currentPolygon(newVal) {
      if (!this.mapReady) return
      await this.$nextTick()
      this.fitBounds()
    },
  },

  created() {
    this.computeCurrentListThrottle = _.throttle(this.computeCurrentList, 50)

    // watch data change
    const unwatch = this.$watch(function() {
      return [
        this.currentAdcode,
        this.currentPolygon,
        this.currentRank,
        this.currentCategory,
        this.fulllist,
      ]
    }, this.computeCurrentListThrottle)
    this.$once('hook:beforeDestroy', unwatch)
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

      // bounds
      this.fitBounds()
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
      this.fulllist = list
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

    async handleDistrictChange(newVal) {
      await this.$nextTick()
    },

    fitBounds() {
      const b = turf.bbox(this.currentPolygon)
      this.map.fitBounds(b, {
        padding: {
          left: 350,
          bottom: 50,
          right: 0,
          top: 0,
        },
      })
    },

    async filterHospitalList() {
      let {fulllist, currentRank, currentCategory, currentAdcode, currentPolygon} = this
      const start = Date.now()
      let list = fulllist

      // rank
      if (currentRank !== ALL) {
        list = list.filter(item => item.rank === currentRank)
      }

      // category
      if (currentCategory !== ALL) {
        list = list.filter(item => item.category === currentCategory)
      }

      // polygon filter
      if (currentPolygon && currentAdcode !== DEFAULT_AD_CODE) {
        list = await worker.filterHospitalList({
          list,
          currentPolygon,
        })
      }

      console.log('calc for currentList ', Date.now() - start)
      return list
    },

    // 计算 currentList
    async computeCurrentList() {
      Loading.show(200)
      let list = []

      try {
        list = await this.filterHospitalList()
      } finally {
        Loading.hide()
      }

      this.currentList = list
    },
  },
}
</script>

<style lang="less" scoped>
.page-home {
  .map-wrapper {
    height: 100vh;
  }
  .map {
    width: 100%;
    height: 100%;
  }

  /deep/ .mapboxgl-ctrl-logo {
    display: none !important;
  }
}

.left-panel {
  width: 300px;
  top: 80px;
  height: 500px;
  background-color: fade(#eee, 90%);
  border-radius: 8px;
  border: 1px solid #ccc;

  .title {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
