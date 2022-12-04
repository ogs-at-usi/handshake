<template>
  <div id="chat" class="col-12 col-md-8 col-lg-9" v-if="chat !== null">
    <header>
      <!-- image & name of the chat: other user image or group image -->
      <img class="pfp" src="icons/default_pfp.png" alt="pfp" />
      <!--      <h2>{{ // chat instanceof Group ? chat.title : otheruser.name }}</h2>-->
    </header>

    <main class="d-flex flex-column">
      <!--       append messages inside here-->
      <ChatMessage
        v-for="(message, index) in chat.messages"
        :key="index"
        :message="message"
      ></ChatMessage>
    </main>

    <footer class="d-flex row align-items-center justify-content-between">
      <form id="search-bar" @submit.prevent="sendMessage()">
        <input
          type="text"
          name="message"
          placeholder="Type something..."
          class="col-9"
          v-model="message"
        />
        <button type="submit">💬</button>
      </form>
    </footer>
  </div>
</template>

<script>
// import Chat from '@/classes/chat';
import ChatMessage from '@/components/ChatMessage';

export default {
  name: 'ChatBoard',
  components: { ChatMessage },
  data() {
    return {
      message: '',
    };
  },
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
  methods: {
    sendMessage() {
      this.$api
        .sendMessage(this.$props.chat._id, {
          content: this.message,
          timestamp: new Date(),
        })
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
