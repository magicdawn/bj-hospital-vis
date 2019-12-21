<template lang="html">
  <a class="collapse-button" :class="[cls, `theme-${theme}`]" @click.stop.prevent="toggle">
    <img :src="IMG.arrow" :class="[direction]" alt="" />
  </a>
</template>

<script>
const IMG = {
  default: {
    arrow: require('./img/default/collapse-arrow.png'),
  },

  ['dark-blue-round']: {
    arrow: require('./img/dark-blue-round/collapse-arrow.png'),
  },
}

export default {
  props: {
    // v-model
    value: {
      type: Boolean,
      required: true,
    },

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

    // 主题
    // default | dark-blue-round
    theme: {
      type: String,
      default: 'default',
    },
  },

  computed: {
    IMG() {
      return IMG[this.theme]
    },

    cls() {
      const ret = [this.side]
      if (this.side === 'right' && this.hasBorder) {
        ret.push('has-border')
      }
      return ret
    },

    direction() {
      if (this.side === 'left') {
        if (this.value) return 'to-left'
        else return 'to-right'
      }

      if (this.side === 'right') {
        if (this.value) return 'to-right'
        else return 'to-left'
      }
    },
  },

  methods: {
    toggle() {
      this.$emit('input', !this.value)
    },
  },
}
</script>

<style lang="less">
.collapse-button {
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  // top: 50%;
  // transform: translateY(-50%);

  &.left {
    left: 100%;
    margin-left: 2px;
  }
  &.right {
    right: 100%;
    margin-right: 2px;

    &.has-border {
      margin-right: 4px;
    }
  }

  // 默认主题
  &.theme-default {
    background-color: rgba(0, 4, 12, 0.8);
    width: 12px;
    height: 38px;
    bottom: 10px;

    img {
      width: 8px;
      height: 4px;
      &.to-left {
        transform: rotate(-90deg);
      }
      &.to-right {
        transform: rotate(90deg);
      }
    }
  }

  // 圆角的
  &.theme-dark-blue-round {
    bottom: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #242c3c;
    box-shadow: 0 0 10px 0 rgba(0, 4, 12, 0.4);

    img {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease-in-out;

      &.to-right {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
