import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './plugins/axios';
import apiClient from './plugins/api-client';
import vuetify from './plugins/vuetify';

Vue.use(apiClient, axios);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  axios,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
