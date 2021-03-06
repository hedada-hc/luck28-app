import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import fun from './js/fun'
import api from './js/api'
import betModel from './js/model'
import auth from './js/auth'
import analysis from './js/analysis'
import gre from './js/greAuth'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.fun = fun
Vue.prototype.api = api
Vue.prototype.bet = betModel
Vue.prototype.isAuth = auth
Vue.prototype.ana = analysis
Vue.prototype.gre = gre

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
