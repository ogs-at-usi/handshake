<template>
  <main id="menu_list">
    <ul class="ps-0">
      <ChatContact
        v-for="(chat, index) in chats"
        :key="index"
        :chat="chat"
        class="ps-4 py-3"
        v-on="$listeners"
        @click.native="$emit('selectChat', chat)"
      />
    </ul>
  </main>
</template>

<script>
import ChatContact from '@/components/ChatContact';

export default {
  name: 'ChatList',
  props: {
    chats: {
      type: Array, // of Chats
    },
  },
  components: { ChatContact },
};
</script>

<style scoped></style>
