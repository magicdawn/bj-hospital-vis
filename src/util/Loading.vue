<template lang="html">
  <div class="global-loading-modal" v-if="value">
    <Spin size="large" :spinning="value" />
  </div>
</template>

<script>
import Vue from 'vue'
import {Spin} from 'ant-design-vue'

const Loading = {
  components: {Spin},

  props: {
    value: {
      type: Boolean,
      required: true,
    },

    delay: {
      type: Number,
      default: 200, // ms
    },
  },
}

const symbolInstance = Symbol('instance')

let showTimer = null

Loading.singleton = () => {
  if (Loading[symbolInstance]) return Loading[symbolInstance]

  const C = Vue.extend(Loading)
  const instance = new C({propsData: {value: false}}).$mount()
  document.body.appendChild(instance.$el)
  Loading[symbolInstance] = instance
  return instance
}

Loading.show = delay => {
  if (delay) {
    clearTimeout(showTimer)
    showTimer = setTimeout(function() {
      Loading.singleton().value = true
    }, delay)
  } else {
    Loading.singleton().value = true
  }
}

Loading.hide = () => {
  clearTimeout(showTimer)
  Loading.singleton().value = false
}

global.Loading = Loading
export default Loading
</script>

<style lang="less" scoped>
.global-loading-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
