// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import PDF from './pdf/PDF'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/fr'
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
import 'bootstrap'
import 'bootstrap-select'
import 'popper.js'
import * as api from './api'

window.$ = require('jquery')
window.JQuery = require('jquery')

Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

/* eslint-disable no-new */
api.loadConfig().then(() => {
  if (location.pathname.includes('/pdf/')) {
    new Vue({
      el: '#app',
      components: { PDF },
      template: '<PDF />'
    })
  } else {
    new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
