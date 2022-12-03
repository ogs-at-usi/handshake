import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './plugin/axios';
import ApiClient from './plugin/api-client';

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.prototype.$api = new ApiClient(axios);

new Vue({
  router,
  store,
  axios,
  render: (h) => h(App),
}).$mount('#app');
