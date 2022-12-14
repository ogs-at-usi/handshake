import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './plugins/axios';
import apiClient from './plugins/api-client';
import vuetify from './plugins/vuetify';
import VuePeerJS from 'vue-peerjs';
import Peer from 'peerjs';


Vue.use(apiClient, axios);
Vue.use(VueAxios, axios);
Vue.use(VuePeerJS, new Peer({
}))

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  axios,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
