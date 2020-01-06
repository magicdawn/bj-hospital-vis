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
        <MglControlGroup position="bottom-right">
          <MglFullscreenControl :container="fullscreenContainer" />
          <MglNavigationControl />
        </MglControlGroup>

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

        <MglPopup
          v-if="currentItem"
          :lnglat="[currentItem.lng, currentItem.lat]"
          :show="true"
          ref="mglPopup"
        >
          <a-card :title="currentItem.name" style="min-width: 350px;">
            <p>名称: {{ currentItem.name }}</p>
            <p>代码: {{ currentItem.code }}</p>
            <p>评级: {{ currentItem.rank }}</p>
            <p>分类: {{ currentItem.category }}</p>
            <p>
              无需定点:
              <template v-if="noNeedToPreSelect(currentItem)">
                <span :style="{color: 'green'}">
                  <a-icon type="smile" />
                  是啊
                </span>
              </template>
              <template v-else>
                <span :style="{color: 'red'}">
                  <a-icon type="frown" />
                  不是
                </span>
              </template>
            </p>
          </a-card>
        </MglPopup>
      </MglMap>
    </div>

    <CollapsePanel class="left-panel" side="left" :gap="10" v-model="showLeftPanel">
      <div class="panel-inner">
        <div class="title">医院筛选</div>

        <a-form :layout="'horizontal'">
          <a-form-item label="地区" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-select v-model="currentAdcode" @change="handleDistrictChange">
              <a-select-option v-for="item in districtList" :key="item.adcode" :value="item.adcode">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="评级" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-select v-model="currentRank">
              <a-select-option v-for="item in ALL_RANK" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="分类" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-select v-model="currentCategory">
              <a-select-option v-for="item in ALL_CATEGORY" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="名称搜索" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-auto-complete
              :dataSource="searchResult"
              style="width: 200px"
              @select="handleSearchSelect"
              @search="handleSearch"
              placeholder="搜索"
              :allowClear="true"
            />
          </a-form-item>
        </a-form>

        <a-card :title="'Info'" size="small" class="info">
          <p>当前共 {{ currentList.length }} 家医院</p>

          <p>
            当前共
            {{
              currentNoNeedPreSelectList.length +
                currentTypeSpecialList.length +
                currentTypeChineseList.length
            }}
            家无需定点医院
          </p>

          <div>
            <a-dropdown :overlayStyle="dropdownOverlayStyle">
              <a class="ant-dropdown-link" href="#">
                A类({{ currentNoNeedPreSelectList.length }} / {{ NO_NEED_PRE_SELECT.length }})
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay" v-if="currentNoNeedPreSelectList.length">
                <a-menu-item
                  v-for="item in currentNoNeedPreSelectList"
                  :key="item.code"
                  @click="e => handleSearchSelect(item.code)"
                >
                  {{ item.name }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>

          <div>
            <a-dropdown :overlayStyle="dropdownOverlayStyle">
              <a class="ant-dropdown-link" href="#">
                对外专科({{ currentTypeSpecialList.length }} / {{ typeSpecialCount }})
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay" v-if="currentTypeSpecialList.length">
                <a-menu-item
                  v-for="item in currentTypeSpecialList"
                  :key="item.code"
                  @click="e => handleSearchSelect(item.code)"
                >
                  {{ item.name }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>

          <div>
            <a-dropdown :overlayStyle="dropdownOverlayStyle">
              <a class="ant-dropdown-link" href="#">
                对外中医({{ currentTypeChineseList.length }} / {{ typeChineseCount }})
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay" v-if="currentTypeChineseList.length">
                <a-menu-item
                  v-for="item in currentTypeChineseList"
                  :key="item.code"
                  @click="e => handleSearchSelect(item.code)"
                >
                  {{ item.name }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-card>

        <a-card v-if="lastItem" :title="'上次查看'" size="small" class="last-item">
          <p>名称: {{ lastItem.name }}</p>
          <p>代码: {{ lastItem.code }}</p>
          <p>评级: {{ lastItem.rank }}</p>
          <p>分类: {{ lastItem.category }}</p>
          <p>
            无需定点:
            <template v-if="noNeedToPreSelect(lastItem)">
              <span :style="{color: 'green'}">
                <a-icon type="smile" />
                是啊
              </span>
            </template>
            <template v-else>
              <span :style="{color: 'red'}">
                <a-icon type="frown" />
                不是
              </span>
            </template>
          </p>
        </a-card>
      </div>
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
import * as GeoUtil from '@/util/GeoUtil.js'

const DEFAULT_AD_CODE = '110000'
const ALL = '全部'
const ALL_RANK = [ALL, '未评级', '三级', '二级', '一级']

const CATEGORY_SPECIAL = '对外专科'
const CATEGORY_CHINESE = '对外中医'
const ALL_CATEGORY = [
  ALL,
  CATEGORY_SPECIAL,
  CATEGORY_CHINESE,
  '对内',
  '对外综合',
  '社区卫生站',
  '村卫生室',
]

/**
 * 不用医保定点
 * http://bj.bendibao.com/bjsi/201387/112815.shtm
 */

const NO_NEED_PRE_SELECT = [
  '中国医学科学院北京协和医院',
  '首都医科大学附属北京同仁医院',
  '首都医科大学宣武医院',
  '首都医科大学附属北京友谊医院',
  '北京大学第一医院',
  '北京大学人民医院',
  '北京大学第三医院',
  '北京积水潭医院',
  '中国中医科学院广安门医院',
  '首都医科大学附属北京朝阳医院',
  '中日友好医院',
  '北京大学首钢医院',
  '首都医科大学附属北京中医医院',
  '首都医科大学附属北京天坛医院',
  '北京世纪坛医院',
  '北京市健宫医院',
  '北京市房山区良乡医院',
  '北京市大兴区人民医院',
  '北京市石景山医院',
]

const NO_NEED_PRE_SELECT_CODE = [
  1110003,
  1110001,
  4110001,
  4110002,
  2110003,
  2110002,
  8110010,
  2110001,
  4151001,
  5110001,
  1110002,
  7110001,
  1151002,
  3110001,
  8110002,
  4110013,
  11110003,
  24110001,
  7110004,
]

const NO_NEED_PRE_SELECT_CODE_MAP = NO_NEED_PRE_SELECT_CODE.reduce((ret, code) => {
  ret[code] = true
  return ret
}, {})

export default {
  components: {CollapsePanel},

  data() {
    return {
      ALL_RANK,
      ALL_CATEGORY,
      fullscreenContainer: document.body,

      center: [116.42610785602722, 39.91191408461194],
      zoom: 12,
      // mapStyle: 'mapbox://styles/mapbox/light-v9',
      mapStyle: 'mapbox://styles/mapbox/streets-zh-v1',
      currentItem: null,
      lastItem: null,

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
          0.1,

          18,
          0.05,
        ],
      },

      showLeftPanel: true,

      /**
       * 搜索项
       */

      currentAdcode: DEFAULT_AD_CODE,
      currentRank: ALL,
      currentCategory: ALL,

      /**
       * search
       */
      searchText: '',

      /**
       * 对外专科 & 中医数量
       */
      typeSpecialCount: 0,
      typeChineseCount: 0,
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

    searchResult() {
      const {searchText, currentList} = this
      let result = currentList

      // search
      if (searchText) {
        result = result.filter(item => {
          const {name, code} = item

          // name match
          if (name.includes(searchText)) return true

          // code match
          if (String(code).includes(searchText)) return true

          return false
        })
      }

      // limit
      const max = 50
      result = result.slice(0, 10)

      // transform
      result = result.map(item => {
        const {code, name} = item
        return {value: String(code), text: name}
      })

      return result
    },

    // 当前不用预先选择的医院列表
    currentNoNeedPreSelectList() {
      return preventObserve(
        _.filter(this.currentList, ({code}) => NO_NEED_PRE_SELECT_CODE_MAP[code])
      )
    },

    currentTypeSpecialList() {
      return preventObserve(_.filter(this.currentList, {category: CATEGORY_SPECIAL}))
    },

    currentTypeChineseList() {
      return preventObserve(_.filter(this.currentList, {category: CATEGORY_CHINESE}))
    },
  },

  watch: {
    async currentPolygon(newVal) {
      if (!this.mapReady || !this.inited) return
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

  beforeCreate() {
    // none reactive data for render
    Object.assign(this, {
      NO_NEED_PRE_SELECT,
      NO_NEED_PRE_SELECT_CODE,
      NO_NEED_PRE_SELECT_CODE_MAP,

      dropdownOverlayStyle: {
        'z-index': 3000,
        'max-height': '90vh',
        'overflow-y': 'scroll',
      },
    })
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

      // mark init complete
      this.inited = true
    },

    async initDistrict() {
      const arr = await request.get('/data/district.json')

      for (let item of arr) {
        const {polyline} = item
        const lines = polyline.split('|')

        const toPolygon = line => [
          line.split(';').map(p => {
            let [lng, lat] = p.split(',')
            ;[lng, lat] = GeoUtil.lnglat([lng, lat])
            return [lng, lat]
          }),
        ]

        const polygon = {
          type: 'MultiPolygon',
          coordinates: [...lines.map(toPolygon)],
        }

        preventObserve(polygon)
        item.polygon = polygon
      }

      this.districtList = arr
    },

    async initList() {
      const json = await request.get('/data/hospital-with-geo.json')

      const list = json.map(row => {
        let [code, name, lng, lat, rank, category] = row

        // to wgs84
        ;[lng, lat] = GeoUtil.lnglat([lng, lat])

        return {code, name, lng, lat, rank, category}
      })

      preventObserve(list)
      this.fulllist = list

      // count
      const typeSpecialCount = _.filter(list, {category: CATEGORY_SPECIAL}).length
      const typeChineseCount = _.filter(list, {category: CATEGORY_CHINESE}).length
      this.typeSpecialCount = typeSpecialCount
      this.typeChineseCount = typeChineseCount
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
      this.lastItem = {...properties}

      // force open
      this.$refs.mglPopup && this.$refs.mglPopup.showPopup()
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

      list = preventObserve(list)
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
      this.currentItem = null
    },

    handleSearch(text) {
      this.searchText = text
    },

    handleSearchSelect(code) {
      const item = _.find(this.currentList, {code: Number(code)})
      if (!item) return

      this.currentItem = {...item}
      this.lastItem = {...item}
      const {lng, lat} = item
      this.map.flyTo({
        center: [lng, lat],
        zoom: 14,
      })
    },

    noNeedToPreSelect(item) {
      const {code, category} = item
      if (NO_NEED_PRE_SELECT_CODE_MAP[code]) return true
      if ([CATEGORY_SPECIAL, CATEGORY_CHINESE].includes(category)) return true
      return false
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

  /deep/ .mapboxgl-map {
    .mapboxgl-ctrl-logo {
      // display: none !important;
    }

    .mapboxgl-popup {
      max-width: 500px !important;
    }

    .mapboxgl-popup-content {
      padding: 0;
    }

    .mapboxgl-popup-close-button {
      z-index: 10;
    }
  }
}

.left-panel {
  top: 70px;
  width: 320px;
  min-height: 200px;

  background-color: fade(#eee, 90%);
  border-radius: 5px;
  border: 1px solid #ccc;

  .panel-inner {
    max-height: ~'calc(100vh - 80px - 30px)';
    overflow-y: scroll;
  }

  .title {
    text-align: center;
    margin-top: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  .info,
  .last-item {
    margin: 0 10px 10px;
    border-radius: 5px;
  }

  /deep/ .ant-form-item {
    margin-bottom: 2px;
  }
  /deep/ .ant-select-auto-complete {
    width: 100% !important;
  }
}
</style>
