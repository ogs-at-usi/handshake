<template>
  <div id="app_container" class="justify-content-between d-flex flex-row h-100">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <ContactList></ContactList>
    <!-- content for the right hand side of the app main page -->
    <!-- chat board containing the chat header, messages and input bar -->
    <ChatBoard :chat="{}"></ChatBoard>
  </div>
</template>

<script>
import ContactList from '@/components/ContactList.vue';
import ChatBoard from '@/components/ChatBoard.vue';
// import Chat from '@/classes/chat';

export default {
  name: 'AppContainer',
  data() {
    return {
      activeChat: null,
    };
  },
  components: { ContactList, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
