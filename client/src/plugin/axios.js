import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // if the error is 401, try to refresh the token and resubmit the request
    if (error.response.status === 401) {
      if (error.config.url === '/auth/refresh') {
        return Promise.reject(error);
      }
      return instance.post('/auth/refresh').then((_) => {
        return instance(error.config);
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
