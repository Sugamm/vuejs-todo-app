import Vue from 'vue'
import App from './App.vue'
import {store} from './store/store'

Vue.config.productionTip = false

window.eventBus = new Vue()

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
