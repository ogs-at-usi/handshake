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
  data() {
    return {
      active: this.chats?.findIndex(
        (c) => this.$store.getters.activeChat?._id === c._id
      ),
    };
  },
  components: { ChatContact },
  watch: {
    active: {
      handler: function (newVal) {
        if (newVal === undefined) {
          this.$store.commit('setActiveChat', { chat: null });
        }
        this.$store.commit('setActiveChat', { chat: this.chats[this.active] });
      },
    },
  },
};
</script>

<style scoped></style>
