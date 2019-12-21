import Vue from 'vue'
import VueMgl, {mgl} from 'vue-mgl'
Vue.use(VueMgl)

import store from './store'
import router from './router'
import App from './components/App.vue'

mgl.accessToken =
  'pk.eyJ1IjoibWFnaWNkYXduIiwiYSI6ImNqYTNyNjd1azJyMGkzMnFyNW1qaXlrcWYifQ.kveR7H0P9euTkAC5QZjg5A'

// vue-ant-design
import {Form, Button, Input, RadioButton, Select} from 'ant-design-vue'
Vue.use(Form)
Vue.use(Button)
Vue.use(Input)
Vue.use(Select)

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
})
