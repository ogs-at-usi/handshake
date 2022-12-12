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
    <ChatBoard ref="chatBoard" :chat="activeChat"></ChatBoard>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu';
import ChatBoard from '@/components/ChatBoard';
import { Chat } from '@/classes/chat';
import { Group } from '@/classes/group';
import { Message } from '@/classes/message';
import { io } from 'socket.io-client';

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

    socket.on('chats:read', chatsJSON => {
      console.log('EVENT chats:read -', chatsJSON);
      this.chats = JSON.parse(chatsJSON).map(c => new Chat(c));
    });

    socket.on('messages:create', messageJSON => {
      console.log('EVENT messages:create -', messageJSON);
      const message = new Message(JSON.parse(messageJSON));
      const chatId = message.chat;
      const chat = this.chats.find(c => c._id === chatId);
      chat.messages.push(message);
      // move the chat to the top of the list
      this.chats = this.chats.filter((chat) => chat._id !== chatId);
      this.chats.unshift(chat);
      if (this.activeChat && this.activeChat._id === chatId) {
        this.$nextTick(() => {
          this.$refs.chatBoard.scrollDown();
        });
      }
    });

    /**
     * Get newly created chat.
     */
    socket.on('chats:create', chatJSON => {
      console.log('EVENT chats:create -', chatJSON);
      const parsed = JSON.parse(chatJSON);
      const chat = parsed.isGroup ? new Group(parsed) : new Chat(parsed);
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

      const chat = this.chats.find(c => {
        if (c.members.length === 2) {
          const otherChatUser = c.members.find(m => m._id !== this.$store.getters.user._id);
          return otherChatUser._id === otherUser._id;
        }
        return false;
      });

      if (chat) {
        this.activeChat = chat;
      } else {
        this.activeChat = new Chat({
          members: [otherUser, this.$store.getters.user],
          messages: []
        });
      }
    },
    overrideChat(id) {
      console.log(id);
      this.activeChat._id = id;
    },
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
