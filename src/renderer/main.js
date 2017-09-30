import Vue from 'vue'
import axios from 'axios'


import App from './App'
import router from './router'
import store from './store'
import fun from './js/fun'
import api from './js/api'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.fun = fun
Vue.prototype.api = api
/* eslint-disable no-new */
var v = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
