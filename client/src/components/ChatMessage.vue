<template>
  <!-- UI: MESSAGE -->
  <div :id="message._id" :class="`card ${selfClass}`">
    <!-- message with header of name of sender (none if ours) and message text -->
    <div class="card-body pb-0">
      <!-- TODO: change v-if to display only if it is a group, add chat in props -->
      <h5 v-if="false" class="card-title">{{ senderName }}</h5>
      <p class="card-text">{{ content }}
        <a v-if='content.length < message.content.length' style='cursor:pointer' @click.prevent='page++'>Show more</a>
      </p>
    </div>

    <!-- timestamp of the message: sent_at for our message, delivered_at for others -->
    <p class="timestamp text-end pe-2">{{ timestamp }}</p>
  </div>
</template>

<script>
import Message from '@/classes/message';

export default {
  name: 'ChatMessage',
  data() {
    return {
      page: 1
    }
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
      let message = this.$props.message.content.substring(0, this.page*this.maxChars);
      if (message.length !== this.message.content.length) {
        message += "...";
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
.timestamp {
  margin: 8px;
}
</style>
