<template>
  <v-container
    class="overflow-hidden pa-0 d-flex flex-row justify-start h-100 w-100 background"
    fluid
    style="max-width: 1450px; position: relative">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <AppMenu
      v-if="!($store.getters.isMobile && activeChat !== null)"
      class="col-12 col-sm-5 col-md-4 col-lg-4"
      :chats="chats"
      @userSelected="userSelected($event)"></AppMenu>
    <!-- content for the right hand side of the app main page -->
    <!-- chat board containing the chat header, messages and input bar -->
    <ChatBoard
      ref="chatBoard"
      :chat="activeChat"
      class="flex-grow-1"></ChatBoard>
  </v-container>
</template>

<script>
import AppMenu from '@/components/AppMenu.vue';
import ChatBoard from '@/components/ChatBoard.vue';
import Chat from '@/classes/chat';
import { io } from 'socket.io-client';
import Message from '@/classes/message';
import {
  askNotificationPermission,
  sendNotification,
} from '@/utils/notification.utils';
import { userSeenMessage } from '@/utils/seen.utils';

export default {
  name: 'AppContainer',
  data() {
    return {
      chats: null,
    };
  },
  created() {
    const socket = io(':8888');
    console.log('Trying to connect');
    this.$store.commit('setSocket', { socket });

    socket.on('chats:read', (chats) => {
      this.chats = chats.map((chat) => new Chat(chat));
    });

    askNotificationPermission();

    socket.on('users:online', (userId) => {
      if (!this.chats) return;
      this.chats.forEach((chat) => {
        chat.members.forEach((member) => {
          if (member._id === userId) {
            member.online = true;
          }
        });
      });
    });

    socket.on('users:offline', (userId) => {
      console.log('EVENT users:offline -', userId);
      this.chats.forEach((chat) => {
        chat.members.forEach((member) => {
          if (member._id === userId) {
            member.online = false;
          }
        });
      });
    });

    socket.on('messages:create', (message) => {
      console.log('EVENT messages:create -', message);
      const chatId = message.chat;
      const chat = this.chats.find((chat) => chat._id === chatId);
      const newMessage = new Message(message);
      chat.messages.push(newMessage);
      // move the chat to the top of the list
      this.chats = this.chats.filter((chat) => chat._id !== chatId);
      this.chats.unshift(chat);
      if (this.activeChat && this.activeChat._id === chatId) {
        // socket.emit('messages:update:read', {
        //   chatId,
        //   lastMessageTime: newMessage.deliveredAt,
        // });

        const lastMessageTime = newMessage.deliveredAt;
        userSeenMessage(socket, chatId, lastMessageTime);

        this.$nextTick(() => {
          this.$refs.chatBoard.scrollDown();
        });
      } else {
        const sender = chat.members.find((member) => {
          return member._id.toString() === message.sender;
        });
        sendNotification(sender.name, message.content, (event) => {
          this.activeChat = chat;
          event.target.close();
        });
      }
    });

    socket.on('messages:update:read', ({ chatId, lastMessageTime, userId }) => {
      console.log('jfjkdfjkjgiojeiofjknvnfjkfnknfj');
      const chat = this.chats.find((chat) => chat._id === chatId);
      chat.messages = chat.messages.map((message) => {
        if (
          new Date(message.deliveredAt) <= new Date(lastMessageTime) &&
          message.seen.indexOf(userId) === -1
        ) {
          message.seen.push(userId);
        }
        return message;
      });
      console.log(lastMessageTime);
    });

    /**
     * Get newly created chat.
     */
    socket.on('chats:create', (chatJson) => {
      console.log('EVENT chats:create -', chatJson);
      const chat = new Chat(chatJson);
      this.chats.unshift(chat);

      if (chat.members[0]._id === this.$store.getters.user._id) {
        this.activeChat = chat;
      }
    });
  },
  methods: {
    userSelected(otherUser) {
      console.log('EVENT User selected - ', otherUser);
      const chat = this.chats.find((chat) => {
        if (chat.members.length === 2) {
          const otherChatUser = chat.members.find(
            (member) => member._id !== this.$store.getters.user._id
          );
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
  },
  computed: {
    activeChat: {
      get() {
        return this.$store.getters.activeChat;
      },
      set(chat) {
        this.$store.commit('setActiveChat', { chat });
      },
    },
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
