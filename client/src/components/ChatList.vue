<template>
  <v-list-item-group v-model="active">
    <ChatContact v-for="(chat, index) in chats" :key="index" :chat="chat" />
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
  computed: {
    active: {
      get() {
        return this.chats?.indexOf(this.$store.state.activeChat);
      },
      set(value) {
        let chat = null;
        if (value !== undefined) chat = this.chats[value];
        this.$store.commit('setActiveChat', { chat });
      },
    },
  },
};
</script>

<style scoped></style>
