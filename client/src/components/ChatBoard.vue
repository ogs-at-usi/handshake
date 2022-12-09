<template>
  <v-container
    v-if="chat !== null"
    id='chat-board'
    class="w-100 pa-0 d-flex flex-column"
    fluid
    style="height: 100vh; overflow: hidden"
  >
    <!-- image & name of the chat: other user image or group image -->
    <v-toolbar
      class="flex-shrink-1 elevation-3"
      style="z-index: 10"
      height="70px"
      max-height="70px"
      color='surface'
    >
      <v-app-bar-nav-icon
        class="me-3 d-block d-sm-none"
        @click="$store.commit('setActiveChat', { chat: null })"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-avatar>
        <img
          alt="icon of person you're chatting with"
          src="/icons/default_pfp.png"
        />
      </v-avatar>
      <v-toolbar-title class="ml-5">{{
        otherPrivateUser.name
      }}</v-toolbar-title>
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
      class="overflow-y-none h-100 py-5 px-4 gap-3 d-flex flex-column"
    >
      <ChatMessage
        v-for="(msg, index) in chat.messages"
        ref="message"
        :key="index"
        :message="msg"
      ></ChatMessage>
    </vue-custom-scrollbar>

    <!-- lower input bar for new message sending -->
    <v-row class="ma-0 flex-shrink-0 surface elevation-5" style="z-index: 10">
      <v-form class="w-100" @submit.prevent="sendMessage">
        <v-text-field
          dense
          v-model="messageString"
          append-outer-icon="mdi-send"
          class="gap-4 px-5 py-5 elevation-0"
          hide-details
          label="Message"
          outlined
          single-line
          ref="messagesInput"
          @submit="sendMessage"
          @click:append-outer="sendMessage"
        />
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar';
import ChatMessage from '@/components/ChatMessage';
import Chat from '@/classes/chat';
import Message from '@/classes/message';
import 'vue-custom-scrollbar/dist/vueScrollbar.css';

export default {
  name: 'ChatBoard',
  components: { ChatMessage, vueCustomScrollbar },
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
      // scroll to the bottom of hte chat
      this.$refs.scroll.$el.scrollTop = this.$refs.scroll.$el.scrollHeight;
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
  },
  watch: {
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
  height: 100vh;
}
</style>
