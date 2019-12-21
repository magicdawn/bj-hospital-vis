<template lang="html">
  <div class="collapse-panel" :class="side" :style="panelStyle">
    <collapse-button v-model="show" :side="side" :has-border="hasBorder" :theme="theme" />
    <slot></slot>
  </div>
</template>

<script>
import CollapseButton from './collapse-button.vue'

export default {
  components: {CollapseButton},
  mixins: [],

  props: {
    side: {
      type: String,
      required: true,
    },

    // side = 右边
    // 有 2px 的 border
    hasBorder: {
      type: Boolean,
      default: false,
    },

    // 离屏幕边距
    gap: {type: Number, default: 0},

    // 是否显示
    value: {
      type: Boolean,
      required: true,
    },

    // 主题
    // default | dark-blue-round
    theme: {
      type: String,
      default: 'default',
    },
  },

  computed: {
    // proxy v-model
    show: {
      get() {
        return this.value
      },
      set(val) {
        return this.$emit('input', val)
      },
    },

    panelStyle() {
      if (!this.value) return
      const {side, gap} = this
      const minusSign = side === 'left' ? '' : '-'
      return {
        transform: `translateX(${minusSign + '100%'}) translateX(${minusSign + gap}px)`,
      }
    },
  },

  methods: {},
}
</script>

<style lang="less">
.collapse-panel {
  position: absolute;
  will-change: transform;
  transition: all 0.3s ease-in-out;

  &.left {
    right: 100%;
  }

  &.right {
    left: 100%;
  }
}
</style>
