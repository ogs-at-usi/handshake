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






window.api = {
  axios: axiosInstance,
  auth: {},
  login: (username, password) => {
    console.log('login');
    return axiosInstance.post('/auth/login', {
      username,
      password,})}, 
  createChat: (otherUserID) => axiosInstance.post('/chats', { otherUserID }),
  sendMessage: (chatID, message) =>
    axiosInstance.post(`/chats/${chatID}/messages`, { message }),
};
