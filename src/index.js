import Vue from 'vue'
import VueMgl, {mgl} from 'vue-mgl'
import {get} from 'lodash'
Vue.use(VueMgl)

import store from './store'
import router from './router'
import App from './components/App.vue'

mgl.accessToken =
  'pk.eyJ1IjoibWFnaWNkYXduIiwiYSI6ImNqYTNyNjd1azJyMGkzMnFyNW1qaXlrcWYifQ.kveR7H0P9euTkAC5QZjg5A'

// vue-ant-design
import {
  Form,
  Button,
  Input,
  RadioButton,
  Select,
  Card,
  AutoComplete,
  Dropdown,
  Menu,
  Icon,
} from 'ant-design-vue'
Vue.use(Form)
Vue.use(Button)
Vue.use(Input)
Vue.use(Select)
Vue.use(Card)
Vue.use(AutoComplete)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Icon)

if (get(router, 'currentRoute.query.debug')) {
  Vue.config({performance: true})
}

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
})
