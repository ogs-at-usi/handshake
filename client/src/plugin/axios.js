import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8888',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return instance.post('/auth/refresh').then((res) => {
        if (res.status === 200) {
          return instance(originalRequest);
        }
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
