import axiosInstance from './axios.js';

window.api = {
  axios: axiosInstance,
  getChats: () => axiosInstance.get('/chats'),
  getMessages: (chatID) => axiosInstance.get(`/messages/${chatID}`),
  getUsers: (filter) => axiosInstance.get(`/users?filter=${filter}`),
  createChat: (otherUserID) => axiosInstance.post('/chats', { otherUserID }),
};
