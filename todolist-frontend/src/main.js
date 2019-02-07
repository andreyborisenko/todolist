import Vue from 'vue'
import App from './App.vue'
import Cookie from 'js-cookie'
// import store from './store'

Vue.config.productionTip = false

Vue.prototype.$jwt = Cookie.get('jwt') || ''

new Vue({
  // store,
  render: h => h(App),
}).$mount('#app')
