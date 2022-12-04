<template>
  <!-- UI: MESSAGE -->
  <div :id="message._id" :class="`card ${selfClass}`">
    <!-- message with header of name of sender (none if ours) and message text -->
    <div class="card-body">
      <h5 class="card-title">{{ senderName }}</h5>
      <p class="card-text">{{ content }}</p>
    </div>

    <!-- timestamp of the message: sent_at for our message, delivered_at for others -->
    <p class="timestamp text-end">{{ timestamp }}</p>
  </div>
</template>

<script>
import Message from '@/classes/message';

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Message,
      required: true,
    },
  },
  computed: {
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
      return this.isSelf ? this.$props.message.sentAt : this.$props.message.deliveredAt;
    },
    content() {
      const retrieveContent = {};
      // TODO: substitute with enum field
      retrieveContent.TEXT = this.$props.message.content;
      return retrieveContent[this.$props.message.type];
    },
    senderName() {
      if (this.isGroup) return null; // this.$props.chat.title;
      console.error('this function should never be reached', this.$props.message);
      return '';
    },
  },
};
</script>

<style scoped></style>
