import Vue from 'vue'
import VueMgl, {mgl} from 'vue-mgl'
Vue.use(VueMgl)

import store from './store'
import router from './router'
import App from './components/App.vue'

mgl.accessToken =
  'pk.eyJ1IjoibWFnaWNkYXduIiwiYSI6ImNqYTNyNjd1azJyMGkzMnFyNW1qaXlrcWYifQ.kveR7H0P9euTkAC5QZjg5A'

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
})
