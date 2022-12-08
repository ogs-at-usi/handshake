<template>
  <div id="chat" class="col-12 col-md-8 col-lg-9" v-if="chat !== null">
    <!-- image & name of the chat: other user image or group image -->
    <header class="d-flex flex-row gap-4 align-items-center">
      <img alt="pfp" class="pfp" src="/icons/default_pfp.png" />
      <h2 class="m-0 text-truncate">{{ chatName }}</h2>
      <h4>{{ status }}</h4>
    </header>

    <!-- message container -->
    <main class="d-flex flex-column" ref="scroll">
      <ChatMessage
        v-for="(msg, index) in chat.messages"
        :key="index"
        :message="msg"
      ></ChatMessage>
    </main>

    <!-- lower input bar for new message sending -->
    <footer class="d-flex row align-items-center justify-content-between">
      <form
        id="search-bar"
        class="d-flex flex-row align-items-center justify-space-between gap-3"
        @submit.prevent="sendMessage()"
      >
        <input
          ref="messageInput"
          type="text"
          name="message"
          placeholder="Type something..."
          class="flex-grow-1"
          v-model="messageString"
        />
        <button type="submit">💬</button>
      </form>
    </footer>
  </div>
</template>

<script>
import ChatMessage from '@/components/ChatMessage';
import Chat from '@/classes/chat';
import Message from '@/classes/message';
import { io } from 'socket.io-client';

export default {
  name: 'ChatBoard',
  components: { ChatMessage },
  data() {
    return {
      messageString: '',
    };
  },
  props: {
    chat: {
      type: Chat,
      default: null,
    },
  },
  methods: {
    scrollDown() {
      const e = this.$refs.scroll;
      e.scrollTop = e.scrollHeight;
    },
    onlySpaces(str) {
      return /^\s*$/.test(str);
    },
    async sendMessage() {
      if (this.onlySpaces(this.messageString)) {
        return;
      }

      let chatId = this.$props.chat._id;
      // if the chat does not exist we create a new one and get the save the id
      if (chatId === null) {
        const { data } = await this.$api.createChat(this.chat.members[0]._id);
        chatId = data._id; // way to unpack data apparently
      }

      // send the message using the chat id
      try {
        const msg = new Message({
          type: 'TEXT',
          content: this.messageString,
          sentAt: new Date(), // TODO: add sentAt implementation server side, field actually ignored
        });

        await this.$api.sendMessage(chatId, msg);
        // after sending it we reset the message box and scroll down
        this.messageString = '';
      } catch (err) {
        alert('Could not send the message. Check your internet connection');
        console.error(err);
      }
    },
  },
  mounted() {
    const socket = io(':8888');
    this.$store.commit('setSocket', socket);

    if (this.messageString > 0) {
      socket.emit('user:typing', this.$props.chat._id);
    }
  },
  computed: {
    otherPrivateUser() {
      const [us1, us2] = this.chat.members;
      return us1._id !== this.$store.getters.user._id ? us1 : us2;
    },
    chatName() {
      if (this.$props.chat.isGroup) {
        return this.$props.chat.title;
      } else {
        return this.otherPrivateUser.name;
      }
    },
    status() {
      return this.otherPrivateUser.online ? 'online' : 'offline';
    },
  },
  watch: {
    chat() {
      // updates when you click on a new chat
      this.$nextTick(() => {
        this.scrollDown();
        this.$refs.messageInput.focus();
      });
    },
  },
};
</script>

<style scoped></style>
