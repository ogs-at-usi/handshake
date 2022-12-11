import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import router from '../router';

const vuexLocal = new VuexPersistence({
  storage: localforage,
  reducer: (state) => ({
    // Only save the state of the module 'auth'
    isLoggedIn: state.isLoggedIn,
    user: state.user,
  }),
  asyncStorage: true,
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: null,
    socket: null,
    activeChat: null,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    user: (state) => state.user,
    socket: (state) => state.socket,
    activeChat: (state) => state.activeChat,
    isMobile: () => window.innerWidth < 600,
  },
  mutations: {
    login(state, { user }) {
      state.isLoggedIn = true;
      state.user = user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      router.push('/login').catch(() => {});
      console.log('logout');
      if (state.socket) state.socket.disconnect();
    },
    setSocket(state, { socket }) {
      state.socket = socket;
    },
    setActiveChat(state, { chat }) {
      state.activeChat = chat;
    },
  },
  actions: {
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        this._vm.$api
          .login(username, password)
          .then((response) => {
            commit('login', { user: response.data.user });
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    signup({ commit }, { username, email, password }) {
      return this._vm.$api.signup(email, username, password);
    },
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
