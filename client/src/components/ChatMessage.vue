<template>
  <!-- UI: MESSAGE -->
  <div
    :id="message._id"
    :class="`card ${message.sender === $store.getters.user._id ? 'self' : ''}`"
  >
    <!-- message with header of name of sender (none if ours) and message text -->
    <div class="card-body">
      <!--      <h5 class="card-title">{{ otheruser.name }}</h5>-->
      <p class="card-text">{{ message.content }}</p>
    </div>

    <!-- timestamp of the message: sent_at for our message, delivered_at for others -->
    <p class="timestamp text-end">{{ message.deliveredAt }}</p>
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
};
</script>

<style scoped></style>
