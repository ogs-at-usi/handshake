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
    const socket = io(':8888');
    console.log('Trying to connect');
    this.$store.commit('setSocket', socket);

    socket.on('chats:read', (chats) => {
      console.log('EVENT chats:read -', chats);
      this.chats = chats.map((chat) => new Chat(chat));
      // this.setActiveChat(this.chats[0]._id);
    });

    socket.on('messages:create', (message) => {
      console.log('EVENT messages:create -', message);
      const chatId = message.chat;
      const chat = this.chats.find((chat) => chat._id === chatId);
      chat.messages.push(new Message(message));
      // move the chat to the top of the list
      this.chats = this.chats.filter((chat) => chat._id !== chatId);
      this.chats.unshift(chat);
    });

    /**
     * Get newly created chat.
     */
    socket.on('chats:create', chatJson => {
      console.log('EVENT chats:create -', chatJson);
      const chat = new Chat(chatJson);
      this.chats.unshift(chat);

      if (chat.members[0]._id === this.$store.getters.user._id) {
        this.activeChat = chat;
      }
    });
  },
  methods: {
    setActiveChat(chat) {
      console.log('EVENT Active chat - ', chat);
      this.activeChat = chat;
    },
    userSelected(otherUser) {
      console.log('EVENT User selected - ', otherUser);
      const chat = this.chats.find((chat) => {
        if (chat.members.length === 2) {
          const otherChatUser = chat.members.find((member) => member._id !== this.$store.getters.user._id);
          return otherChatUser._id === otherUser._id;
        }
        return false;
      });
      if (chat) {
        this.activeChat = chat;
      } else {
        this.activeChat = new Chat({
          members: [otherUser, this.$store.getters.user],
          messages: [],
        });
      }
    },
    overrideChat(id) {
      console.log(id);
      this.activeChat._id = id;
    }
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
