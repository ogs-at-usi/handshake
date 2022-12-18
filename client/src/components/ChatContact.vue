<template>
  <!-- UI: CONTACT -->
  <v-list-item :ripple="false" active-class="secondary" class="py-2 gap-3">
    <!-- image of the other user or group chat -->
    <v-badge
      :content="numberOfUnseen"
      :value="numberOfUnseen"
      color="green"
      overlap>
      <v-list-item-avatar class="ma-0">
        <img :src="imageId" class="pfp" alt="pfp" />
      </v-list-item-avatar>
    </v-badge>

    <!-- name of the other user or group chat -->
    <v-list-item-content class="ml-1">
      <v-list-item-title class="text--primary font-weight-bold">
        {{ name }}
      </v-list-item-title>

      <v-list-item-subtitle class="text--secondary">
        {{ lastMessage }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <!-- notification badge -->
    <v-list-item-action-text
      class="pb-3 align-self-end justify-center d-flex flex-column align-center gap-1">
      <p
        class="badge primary lighten-1 text--primary rounded-xl align-center justify-center text-center px-2"
        style="width: fit-content">
        {{ numberOfUnseen }}
      </p>
      <p class="notification badge rounded-pill text-bg-light">
        {{ lastMessageTimestamp }}
      </p>
    </v-list-item-action-text>
  </v-list-item>
</template>

<script>
import Chat from '@/classes/chat';
import Group from '@/classes/group';
import { formatTime } from '@/utils/message.utils';

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
      if (this.chat?.messages && this.chat.messages.length > 0) {
        const lastMessage = this.chat.messages[this.chat.messages.length - 1];
        switch (lastMessage.type) {
          case 'TEXT':
            return lastMessage.content;
          case 'IMAGE':
            return '📸 Image';
          case 'VIDEO':
            return '🎥 Video';
          case 'AUDIO':
            return '🎵 Audio';
          case 'DOCUMENT':
            return '📁 File';
          default:
            return '';
        }
      }
      return '';
    },
    lastMessageTimestamp() {
      if (this.chat.messages && this.chat.messages.length > 0) {
        const timestamp =
          this.chat.messages[this.chat.messages.length - 1].sentAt;
        return formatTime(timestamp);
      }
      return '';
    },
    isActive() {
      return this.$store.getters.activeChat?._id === this.chat?._id;
    },
    numberOfUnseen() {
      const unseenMessages = this.chat.messages.filter(
        (message) =>
          message.seen.indexOf(this.$store.getters.user._id) === -1 &&
          message.sender._id !== this.$store.getters.user._id
      );
      if (unseenMessages.length === 0) {
        return null;
      }
      return unseenMessages.length;
    },
  },
};
</script>

<style scoped></style>
