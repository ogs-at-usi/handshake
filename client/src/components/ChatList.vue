<template>
  <main id="menu_list">
    <ChatContact v-for="(chat, index) in chats"
                 :key="index"
                 :chat="chat">
    </ChatContact>
  </main>
</template>

<script>
import ChatContact from '@/components/ChatContact.vue';

export default {
  name: 'ChatList',
  props: {
    chats: {
      type: Array, // of Chats
      required: true,
    },
  },
  components: { ChatContact },
};
</script>

<style scoped>

</style>