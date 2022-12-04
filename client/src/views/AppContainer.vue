<template>
  <div id="app_container" class="justify-content-between d-flex flex-row h-100">
    <!-- content for the left hand side of the app main page -->
    <!-- about profile contact and image, search bar and contact chat list -->
    <AppMenu @userSelected='userSelected($event)'></AppMenu>
    <!-- content for the right hand side of the app main page -->
    <!-- chat board containing the chat header, messages and input bar -->
    <ChatBoard :chat="{}"></ChatBoard>
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
    };
  },
  methods: {
    userSelected(user) {
      console.log(user.name);
    },
  },
  components: { AppMenu, ChatBoard },
};
</script>

<style scoped>
/* put div as flex */
</style>
