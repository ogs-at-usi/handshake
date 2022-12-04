<template>
  <div id="app_container" class="justify-content-between d-flex flex-row h-100">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <AppMenu
      :chats="chats"
      @selectChat="setActiveChat($event)"
      @userSelected="userSelected($event)"
    ></AppMenu>
    <!-- content for the right hand side of the app main page -->
    <!-- chat board containing the chat header, messages and input bar -->
    <ChatBoard :chat="activeChat"></ChatBoard>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu.vue';
import ChatBoard from '@/components/ChatBoard.vue';
import Chat from '@/classes/chat';
import { io } from 'socket.io-client';
import Message from '@/classes/message';

export default {
  name: 'AppContainer',
  data() {
    return {
      activeChat: null,
      chats: null,
    };
  },
  mounted() {
    const socket = io('localhost:8888');
    console.log('Trying to connect');
    this.$store.commit('setSocket', socket);
    socket.on('chats:read', (chats) => {
      console.log('Chats received', chats);
      this.chats = chats.map((chat) => new Chat(chat));
      // this.setActiveChat(this.chats[0]._id);
    });
    socket.on('messages:create', (message) => {
      console.log('Message received', message);
      const chatId = message.chat;
      const chat = this.chats.find((chat) => chat._id === chatId);
      chat.messages.push(new Message(message));
    });
  },
  methods: {
    setActiveChat(chat) {
      console.log('EVENT Active chat - ', chat);
      this.activeChat = chat;
    },
    userSelected(otherUser) {
      this.activeChat = new Chat({
        members: [otherUser],
        messages: [],
      });
    },
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
