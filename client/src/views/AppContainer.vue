<template>
  <div id="app_container" class="justify-content-between d-flex flex-row h-100">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <AppMenu :chats="chats" @selectChat='setActiveChat($event)'></AppMenu>
    <!-- content for the right hand side of the app main page -->
    <!-- chat board containing the chat header, messages and input bar -->
    <ChatBoard :chat="activeChat"></ChatBoard>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu.vue';
import ChatBoard from '@/components/ChatBoard.vue';

export default {
  name: 'AppContainer',
  data() {
    return {
      activeChat: null,
      chats: this.$store.getters.user.chats,
    };
  },
  methods: {
    setActiveChat(chat) {
      console.log("EVENT Active chat - ", chat);
      this.activeChat = chat;
    },
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
