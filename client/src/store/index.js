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
    theme: state.theme,
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
    theme: null,
    calling: null,
    popup: null,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    user: (state) => state.user,
    socket: (state) => state.socket,
    activeChat: (state) => state.activeChat,
    isMobile: () => window.innerWidth < 600,
    theme: (state) => state.theme,
    calling: (state) => state.calling,
    popup: (state) => state.popup,
  },
  mutations: {
    login(state, { user }) {
      state.isLoggedIn = true;
      state.user = user;
    },
    logout(state) {
      state.isLoggedIn = false;
      router.push('/login').catch(() => {});
      state.user = null;
      if (state.socket) state.socket.disconnect();
    },
    setSocket(state, { socket }) {
      state.socket = socket;
    },
    setActiveChat(state, { chat }) {
      state.activeChat = chat;
    },
    setTheme(state, { theme }) {
      state.theme = theme;
    },
    setCalling(state, data) {

      state.calling = data;
      console.log('setCalling', data);
    },
    setPopup(state, data) {

      state.popup = data;

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
    async refreshToken({ commit }) {
      try {
        await this._vm.$api.refreshToken();
      } catch (error) {
        commit('logout');
      }
    },
    call({ commit, getters }, roomId) {
      const myPeer = this._vm.$peer;
      const myName = getters.user.name;
      const newRoom = 'videocall_' + roomId;
      commit('setCalling', {
        roomId: roomId,
        newRoom: newRoom,
        myName,
        eventData: [roomId, myPeer.id, myName],
      });
      console.log("setCalling: ", roomId, myPeer.id, myName);
    },
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
