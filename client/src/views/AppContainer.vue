<template>
  <v-container
    class="overflow-hidden pa-0 d-flex flex-row justify-start h-100 w-100 background"
    fluid
    style="max-width: 1450px; position: relative">
    <VideocallPopup
      v-if="this.$store.getters.popup != null"
      id="videocallPopup" />

    <AppMenu
      v-if="!($store.getters.isMobile && activeChat !== null)"
      class="col-12 col-sm-5 col-md-4 col-lg-4"
      :chats="chats"
      @userSelected="userSelected($event)"
      @createGroup="createGroup($event)" />
    <VideoChat v-if="this.$store.getters.calling != null"> </VideoChat>
    <ChatBoard
      v-else
      ref="chatBoard"
      :chat="activeChat"
      class="flex-grow-1"></ChatBoard>
  </v-container>
</template>

<script>
import AppMenu from '@/components/AppMenu';
import ChatBoard from '@/components/ChatBoard';
import { Chat } from '@/classes/chat';
import { Group } from '@/classes/group';
import { Message } from '@/classes/message';
import { io } from 'socket.io-client';
import VideoChat from '@/components/VideoChat.vue';
import VideocallPopup from '@/components/VideocallPopup.vue';
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
    const socket = io();
    console.log('Trying to connect');
    this.$store.commit('setSocket', { socket });

    socket.on('chats:read', (chats) => {
      console.log('EVENT chats:read -', chats);
      // TODO: change is_group to isGroup in Chat schema in db
      this.chats = chats.map((c) => (c.is_group ? new Group(c) : new Chat(c)));
    });

    askNotificationPermission();

    socket.on('users:online', (userId) => {
      //  have no chats, no one online user we have a chat with
      if (!this.chats) return;

      this.chats.forEach((c) =>
        c.members.forEach((m) => {
          if (m._id === userId) m.online = true;
        })
      );
    });

    socket.on('users:offline', (userId) => {
      console.log('EVENT users:offline -', userId);
      this.chats.forEach((c) =>
        c.members.forEach((m) => {
          if (m._id === userId) m.online = false;
        })
      );
    });

    socket.on('messages:create', (message) => {
      console.log('EVENT messages:create -', message);
      message = new Message(message);
      const chatId = message.chat;
      const chat = this.chats.find((c) => c._id === chatId);
      if (!chat) return;
      chat.messages.push(message);
      // move the chat to the top of the list
      this.chats = this.chats.filter((c) => c._id !== chatId);
      this.chats.unshift(chat);

      if (this.activeChat && this.activeChat._id === chatId) {
        const lastMessageTime = message.deliveredAt;
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
    });

    /**
     * Get newly created chat.
     */
    socket.on('chats:create', (chat) => {
      console.log('EVENT chats:create -', chat);
      chat = chat.isGroup ? new Group(chat) : new Chat(chat);
      this.chats.unshift(chat);

      if (
        chat.members[0]._id === this.$store.getters.user._id ||
        (chat.isGroup &&
          chat.members[chat.members.length - 1]._id ===
            this.$store.getters.user._id)
      ) {
        this.activeChat = chat;
      }
    });

    socket.on('videochat:notify', (chatName, roomId) => {
      console.log('popup!');
      this.$store.commit('setPopup', { chatName: chatName, roomId: roomId });
    });
  },
  methods: {
    userSelected(otherUser) {
      console.log('EVENT User selected - ', otherUser);

      const chat = this.chats.find((c) => {
        if (c.members.length === 2) {
          const otherChatUser = c.members.find(
            (m) => m._id !== this.$store.getters.user._id
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
  components: { VideocallPopup, AppMenu, ChatBoard, VideoChat },
};
</script>

<style scoped>
#videocallPopup {
  position: absolute;
  bottom: 32px;
  left: 32px;
  z-index: 100;
}
</style>
