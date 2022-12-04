import axios from 'axios';
import store from '../store';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      store.getters.isLoggedIn &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;
      // if the refresh function fails then we need to logout (Vuex)
      return instance
        .post('/auth/refresh')
        .then((res) => {
          if (res.status === 200) {
            return instance(originalRequest);
          }
        })
        .catch(() => {
          // how to access Vuex
          store.commit('logout');
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);

export default instance;
