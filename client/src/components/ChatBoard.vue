<template>
  <div id="chat" class="col-12 col-md-8 col-lg-9" v-if="chat !== null">
    <!-- image & name of the chat: other user image or group image -->
    <header>
      <img alt='pfp' class='pfp' src='/icons/default_pfp.png' />
      <!-- <h2>{{ // chat instanceof Group ? chat.title : otheruser.name }}</h2>-->
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
      <form id="search-bar" @submit.prevent="sendMessage()">
        <input
          type="text"
          name="message"
          placeholder="Type something..."
          class="col-9"
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
        .sendMessage(chatId, new Message({
          type: "TEXT",
          content: this.messageString,
          sentAt: new Date(), // TODO: add sentAt implementation server side, field actually ignored
        }))
        .then(() => {
          this.$router.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped></style>
