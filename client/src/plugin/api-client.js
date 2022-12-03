class ApiClient {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Retrieve the list of chats that match the filter.
   * @param username
   * @param password
   * @returns {*}
   */
  login(username, password) {
    return this.axiosInstance.post('/auth/login', { username, password });
  }

  /**
   * Retrieve the list of chats that match the filter.
   * @param email
   * @param username
   * @param password
   * @returns {*}
   */
  signup(email, username, password) {
    return this.axiosInstance.post('/auth/register', {
      email,
      username,
      password,
    });
  }

  /**
   * Retrieve the list of users that match the filter.
   * @param filter {string} The filter to apply
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  getUsers(filter) {
    return this.axiosInstance.get(`/users?filter=${filter}`);
  }

  /**
   * Create a chat with the logged user and the user with the given ID.
   * @param otherUserID {string} The ID of the other user
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  createChat(otherUserID) {
    return this.axiosInstance.post('/chats', { otherUserID });
  }

  /**
   * Create a message in a chat.
   * @param chatID {string} The ID of the chat
   * @param message {Message} The message to create
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  sendMessage(chatID, message) {
    return this.axiosInstance.post(`/chats/${chatID}/messages`, {
      type: message.type,
      content: message.content,
    });
  }
}

export default {
  /**
   * Install the plugin.
   * @param Vue {Vue} The Vue instance
   * @param axiosInstance {AxiosInstance} The axios instance
   */
  install(Vue, axiosInstance) {
    Vue.prototype.$api = new ApiClient(axiosInstance);
  },
};
