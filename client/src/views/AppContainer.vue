<template>
  <v-container
    class="overflow-hidden pa-0 d-flex flex-row justify-start h-100 w-100 background"
    fluid
    style="max-width: 1450px; position: relative">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <div v-if='this.$store.getters.popup != null' id='popupContainer'>
      <v-dialog
        v-model="this.$store.getters.popup"
        persistent
        style="position: relative !important"
        eager
       >
      <v-card

      >
        <v-card-title
        class="text-center font-weight-bold primary white--text elevation-7 pa-5  flex-row align-center justify-center d-flex"
        >{{this.$store.getters.popup}} is calling you
        </v-card-title>


        <v-card-actions class="d-flex flex-row justify-center align-center">
          <v-btn
            color="success"
            class="elevation-7"
            @click="acceptCall"
            >Accept</v-btn
          >
          <v-btn
            color="error"
            class="elevation-7"
            @click="rejectCall"
            >Decline</v-btn
          >
        </v-card-actions>



      </v-card>
    </v-dialog>
    </div>
    <AppMenu
      v-if="!($store.getters.isMobile && activeChat !== null)"
      class="col-12 col-sm-5 col-md-4 col-lg-4"
      :chats="chats"
      @userSelected="userSelected($event)"></AppMenu>
    <VideoChat v-if="this.$store.getters.calling != null">
    </VideoChat>
    <ChatBoard v-else
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
import VideoChat from '@/components/VideoChat.vue';

export default {
  name: 'AppContainer',
  data() {
    return {
      dialog: false,
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
      chat.messages.push(new Message(message));
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
    socket.on('chats:create', (chatJson) => {
      console.log('EVENT chats:create -', chatJson);
      const chat = new Chat(chatJson);
      this.chats.unshift(chat);

      if (chat.members[0]._id === this.$store.getters.user._id) {
        this.activeChat = chat;
      }
    });

    socket.on('calling-me', (chatName) => {
      this.$store.commit('setPopup', { chatName: chatName });
    });


  },
  methods: {
    acceptCall() {
      this.$store.commit('setCalling', { roomId: this.$store.getters.popup });
      this.$store.commit('setPopup', { chatName: null });

    },
    rejectCall() {
      this.$store.commit('setPopup', { chatName: null });
    },
    userSelected(otherUser) {
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
  components: { AppMenu, ChatBoard, VideoChat },
};
</script>

<style scoped>

>>> .v-dialog {
  overflow-y: visible;
}

.popup {
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 23px;
  right: 28px;
  width: 280px;
}
/* put div as flex */
</style>
