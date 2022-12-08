<template>
  <!-- UI: CONTACT -->
  <v-list-item
    class="py-2 gap-3"
    @click="$store.commit('setActiveChat', { chat })"
  >
    <!-- image of the other user or group chat -->
    <v-list-item-avatar class="mr-0">
      <img :src="imageId" class="pfp" alt="pfp" />
    </v-list-item-avatar>

    <!-- name of the other user or group chat -->
    <v-list-item-content>
      <v-list-item-title class="text--primary font-weight-bold">
        {{ name }}
      </v-list-item-title>
      <v-list-item-subtitle class="text--secondary">
        {{ lastMessage }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <!-- notification badge -->
    <v-list-item-action-text>
      <p class="notification badge rounded-pill text-bg-light">test</p>
    </v-list-item-action-text>
  </v-list-item>
</template>

<script>
import Chat from '@/classes/chat';
import Group from '@/classes/group';

export default {
  name: 'ChatContact',
  props: {
    chat: {
      type: Chat,
      required: true,
    },
  },
  computed: {
    otherPrivateUser() {
      const [us1, us2] = this.chat.members;
      return us1._id !== this.$store.getters.user._id ? us1 : us2;
    },
    imageId() {
      if (this.chat instanceof Group) return this.chat._id;
      else {
        // TODO: check if the user has an image with a axios HTTP request
        // then if exist, return this.otherPrivateUser._id;
        return 'icons/default_pfp.png';
      }
    },
    name() {
      if (this.chat.isGroup) return this.chat.title;
      else return this.otherPrivateUser.name;
    },
    lastMessage() {
      return this.chat.messages && this.chat.messages.length > 0
        ? this.chat.messages[this.chat.messages.length - 1].content
        : '';
    },
  },
};
</script>

<style scoped></style>
