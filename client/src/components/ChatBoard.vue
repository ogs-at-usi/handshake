<template>
  <v-container
    v-if="chat !== null"
    id="chat-board"
    class="w-100 pa-0 d-flex flex-column"
    fluid
    style="height: 100vh; overflow: hidden">
    <!-- image & name of the chat: other user image or group image -->
    <v-toolbar
      class="flex-shrink-1 elevation-3"
      style="z-index: 10"
      height="70px"
      max-height="70px"
      color="secondary">
      <v-app-bar-nav-icon
        class="me-3 d-block d-sm-none"
        @click="$store.commit('setActiveChat', { chat: null })">
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-avatar>
        <img
          alt="icon of person you're chatting with"
          src="/icons/default_pfp.png" />
      </v-avatar>
      <v-toolbar-title class="ml-5">
        <span class="text--primary">{{ otherPrivateUser.name }}</span>
        <span
          class="text--secondary subtitle-2 d-block"
          style="line-height: 1.1">
          {{ status }}
        </span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="me-2" icon>
        <v-icon>mdi-video</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- message container -->
    <vue-custom-scrollbar
      ref="scroll"
      class="overflow-y-none h-100 py-5 px-4 gap-3 d-flex flex-column">
      <ChatMessage
        v-for="(msg, index) in chat.messages"
        ref="message"
        :key="index"
        :message="msg"></ChatMessage>
    </vue-custom-scrollbar>

    <!-- lower input bar for new message sending -->
    <v-row
      class="ma-0 px-2 px-md-5 py-3 py-md-5 gap-3 flex-shrink-0 secondary elevation-5 d-flex justify-center align-center flex-nowrap"
      style="z-index: 10">
      <v-btn icon>
        <v-icon>mdi-emoticon</v-icon>
      </v-btn>
      <FileUploader :chat-id="chat._id"></FileUploader>
      <v-form class="flex-grow-1" @submit.prevent="sendMessage">
        <v-text-field
          ref="messagesInput"
          dense
          v-model="messageString"
          color="textPrimary"
          hide-details
          label="Message"
          outlined
          single-line
          class="elevation-0 secondary" />
      </v-form>
      <v-btn icon @click="sendMessage">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar';
import ChatMessage from '@/components/ChatMessage';
import 'vue-custom-scrollbar/dist/vueScrollbar.css';
import FileUploader from '@/components/FileUploader';
import { Chat } from '@/classes/chat';
import { Group } from '@/classes/group';
import { Message } from '@/classes/message';

export default {
  name: 'ChatBoard',
  components: { FileUploader, ChatMessage, vueCustomScrollbar },
  data() {
    return {
      messageString: '',
      typingTimeout: null,
    };
  },
  props: {
    chat: {
      type: [ Chat, Group ],
      default: null,
    },
  },
  methods: {
    updateTypingStatus(typing) {
      if (typing) {
        this.$store.getters.socket.emit('user:typing', {
          chatId: this.$props.chat._id,
        });
      } else {
        this.$store.getters.socket.emit('user:notTyping', {
          chatId: this.$props.chat._id,
        });
      }
    },
    scrollDown() {
      // scroll to the bottom of hte chat
      this.$refs.scroll.$el.scrollTop = this.$refs.scroll.$el.scrollHeight;
    },
    onlySpaces(str) {
      return /^\s*$/.test(str);
    },
    async sendMessage() {
      if (this.onlySpaces(this.messageString)) return;
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
  created() {
    this.$store.getters.socket.on('user:typing', ({ chatId, userId }) => {
      if (this.$props.chat === null) {
        return;
      }
      if (
        chatId === this.$props.chat._id &&
        userId !== this.$store.state.user._id
      ) {
        this.otherPrivateUser.typing = true;
      }
    });
    this.$store.getters.socket.on('user:notTyping', ({ chatId, userId }) => {
      if (this.$props.chat === null) {
        return;
      }
      if (
        chatId === this.$props.chat._id &&
        userId !== this.$store.state.user._id
      ) {
        this.otherPrivateUser.typing = false;
      }
    });
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
      // priority: typing > online > offline
      if (this.otherPrivateUser.typing) return 'Typing...';
      if (this.otherPrivateUser.online) return 'Online';
      return 'Offline';
    },
  },
  watch: {
    messageString(oldValue, newValue) {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      this.updateTypingStatus(oldValue.length !== newValue.length);
      this.typingTimeout = setTimeout(() => {
        this.updateTypingStatus(false);
      }, 800);
    },
    chat() {
      if (this.chat === null) return;
      // updates when you click on a new chat
      this.$nextTick(() => {
        this.scrollDown();
        this.$refs.messagesInput.focus();
      });
    },
  },
};
</script>

<style scoped>
#chat-board {
  height: 100%;
}
</style>
