import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import Notifications from 'vue-notification'

Vue.use(VueMaterial)
Vue.use(Notifications)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
