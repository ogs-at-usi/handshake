<template>
  <div id="app_container" class="justify-content-between d-flex flex-row h-100">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <AppMenu @userSelected='userSelected($event)'></AppMenu>
    <!-- content for the right hand side of the app main page -->
    <!-- chat board containing the chat header, messages and input bar -->
    <ChatBoard :chat='activeChat'></ChatBoard>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu.vue';
import ChatBoard from '@/components/ChatBoard.vue';
import Chat from '@/classes/chat';
import io from 'socket.io-client';

export default {
  name: 'AppContainer',
  data() {
    return {
      activeChat: null,
    };
  },
  mounted() {
    const socket = io(":8888");
    this.$store.commit("setSocket", socket);
    socket.on("connect", () => {
      console.log("connected");
    });
  },
  methods: {
    userSelected(otherUser) {
      this.activeChat = new Chat({
        members: [otherUser],
        messages: [],
      });
    },
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
