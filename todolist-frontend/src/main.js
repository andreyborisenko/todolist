import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

// Vue.prototype.$jwt = Cookie.get('jwt') || ''
Vue.prototype.$apiPath = 'http://localhost:5000'

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
