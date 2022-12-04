<template>
  <main v-if="chats !== null" id="menu_list">
    <ChatContact v-for="(chat, index) in chats"
                 :key="index"
                 :chat="chat"
                 v-on="$listeners"
                 @click.native="$emit('selectChat', chat._id)" />
  </main>
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

<style scoped>

</style>