<template>
  <v-list-item-group >
    <ChatContact
      v-for="(chat, index) in chats"
      :key="index"
      :chat="chat"
      v-on="$listeners"
      @click.native="$emit('selectChat', chat)"
    />
  </v-list-item-group>
</template>

<script>
import ChatContact from '@/components/ChatContact.vue';

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
