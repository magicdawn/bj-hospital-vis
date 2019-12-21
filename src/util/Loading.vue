<template lang="html">
  <div class="global-loading-modal" v-if="value">
    <Spin :spinning="value" size="large" />
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
  },
}

const symbolInstance = Symbol('instance')

Loading.singleton = () => {
  if (Loading[symbolInstance]) return Loading[symbolInstance]

  const C = Vue.extend(Loading)
  const instance = new C({propsData: {value: false}}).$mount()
  document.body.appendChild(instance.$el)
  Loading[symbolInstance] = instance
  return instance
}

Loading.show = delay => {
  Loading.singleton().value = true
}

Loading.hide = () => {
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
