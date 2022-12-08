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
          @keydown="updateTypingStatus"
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
    updateTypingStatus() {
      if (this.messageString.length > 0) {
        console.log('You are typing');
        this.$store.getters.socket.emit('user:typing', {
          chatId: this.$props.chat._id,
        });
      } else {
        console.log('You are not typing');
        this.$store.getters.socket.emit('user:notTyping', {
          chatId: this.$props.chat._id,
        });
      }
    },
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
  created() {
    this.$store.getters.socket.on('user:typing', ({ chatId }) => {
      console.log('someone is typing', chatId);
      if (chatId === this.$props.chat._id) {
        this.otherPrivateUser.typing = true;
      }
    });
    this.$store.getters.socket.on('user:notTyping', ({ chatId }) => {
      console.log('someone is not typing', chatId);
      if (chatId === this.$props.chat._id) {
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
    chat() {
      // updates when you click on a new chat
      this.$nextTick(() => {
        this.scrollDown();
        this.$refs.messageInput.focus();
      });
    },
    // messageString() {
    //   if (this.messageString > 0) {
    //     console.log('You are typing');
    //     this.$store.getters.socket.emit('user:typing', {
    //       chatId: this.$props.chat._id,
    //     });
    //   }
    // },
  },
};
</script>

<style scoped></style>
