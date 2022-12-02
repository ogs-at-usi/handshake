// create a frontend file with a axios instance
// requires axios imported in the index.html (CDN: https://unpkg.com/axios/dist/axios.min.js)
// or it could also be imported here from file
// eslint-disable-next-line no-undef
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // if the error is 401, try to refresh the token and resubmit the request
    if (error.response.status === 401) {
      if (error.config.url === '/auth/refresh') {
        return Promise.reject(error);
      }
      return axiosInstance.post('/auth/refresh').then((_) => {
        return axiosInstance(error.config);
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
