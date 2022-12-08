<template>
  <!-- UI: MESSAGE -->
  <div
    :style="{ justifyContent: isSelf ? 'end' : 'start' }"
    class="ma-0 d-flex"
  >
    <v-card
      :id="message._id"
      class="rounded-lg message"
      elevation="2"
      style="height: fit-content"
    >
      <v-card-title
        v-if="!isSelf && isGroup"
        class="font-weight-regular subtitle-1 pa-3 pb-0"
        >{{senderName}}</v-card-title
      >
      <v-card-text class="pa-3 pb-1 text--primary">
        {{ content }}
        <a
          v-if="content.length < message.content.length"
          style="cursor: pointer"
          @click.prevent="page++"
          >Show more</a
        >
      </v-card-text>
      <v-card-actions class="justify-end pt-0">
        <span class="text--secondary text-caption">{{ timestamp }}</span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Message from '@/classes/message';

export default {
  name: 'ChatMessage',
  data() {
    return {
      page: 1,
    };
  },
  props: {
    message: {
      type: Message,
      required: true,
    },
  },
  computed: {
    maxChars() {
      return 500;
    },
    isSelf() {
      return this.$props.message.sender === this.$store.getters.user._id;
    },
    isGroup() {
      // TODO: M3 pass also the chat class
      // this.$props.chat instanceof Group
      return null;
    },
    selfClass() {
      return this.isSelf ? 'self' : '';
    },
    timestamp() {
      const time = this.isSelf
        ? this.$props.message.sentAt
        : this.$props.message.deliveredAt;
      const datetime = new Date(time);
      const hours = datetime.getHours().toString().padStart(2, '0');
      const minutes = datetime.getMinutes().toString().padStart(2, '0');
      const seconds = datetime.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    content() {
      const retrieveContent = {};
      // TODO: substitute with enum field
      let message = this.$props.message.content.substring(
        0,
        this.page * this.maxChars
      );
      if (message.length !== this.message.content.length) {
        message += '...';
      }
      retrieveContent.TEXT = message;
      return retrieveContent[this.$props.message.type];
    },
    senderName() {
      if (this.isGroup) return null; // this.$props.chat.title;
      console.error(
        'this function should never be reached',
        this.$props.message
      );
      return '';
    },
  },
};
</script>

<style scoped>
.message {
  max-width: 70%!important;
}
@media only screen and (max-width: 600px) {
  .message {
    max-width: 85%!important;
  }
}
</style>
