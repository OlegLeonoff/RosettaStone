import Vue from 'vue'
import App from './App.vue'
import Router from './router'
import vuetify from './plugins/vuetify';
import { store } from './store'
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  store,
  vuetify,
  router: Router
}).$mount('#app')


