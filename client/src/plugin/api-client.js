class ApiClient {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  getUsers(filter) {
    return this.axiosInstance.get(`/users?filter=${filter}`);
  }

  createChat(otherUserID) {
    return this.axiosInstance.post('/chats', { otherUserID });
  }

  sendMessage(chatID, message) {
    return this.axiosInstance.post(`/chats/${chatID}/messages`, { message });
  }
}

export default ApiClient;
