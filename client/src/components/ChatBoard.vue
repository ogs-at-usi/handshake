<template>
  <div id="chat" class="col-12 col-md-8 col-lg-9">
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
      <!--      <ChatMessage-->
      <!--        :message="{-->
      <!--          _id: '1',-->
      <!--          content: 'Hello',-->
      <!--          deliveredAt: '2021-05-01T00:00:00.000Z',-->
      <!--        }"-->
      <!--      />-->
    </main>

    <footer class="d-flex row align-items-center justify-content-between">
      <form id="search-bar" action="">
        <input
          type="text"
          name="message"
          placeholder="Type something..."
          class="col-9"
        />
        <button>💬</button>
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
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
