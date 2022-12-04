<template>
  <div id="chat" class="col-12 col-md-8 col-lg-9" v-if="chat !== null">
    <!-- image & name of the chat: other user image or group image -->
    <header class="d-flex flex-row gap-4 align-items-center">
      <img alt="pfp" class="pfp" src="/icons/default_pfp.png" />
      <h2>{{ chatName }}</h2>
    </header>

    <!-- message container -->
    <main class="d-flex flex-column">
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
    async sendMessage() {
      let chatId = this.$props.chat._id;

      if (chatId === null) {
        const { data } = await this.$api.createChat(this.chat.members[0]._id);
        chatId = data._id; // way to unpack data apparently
      }

      this.$api
        .sendMessage(
          chatId,
          new Message({
            type: 'TEXT',
            content: this.messageString,
            sentAt: new Date(), // TODO: add sentAt implementation server side, field actually ignored
          })
        )
        .then(() => {})
        .catch((err) => {
          alert('Could not send the message. Check your internet connection');
          console.error(err);
        });
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
};
</script>

<style scoped></style>
