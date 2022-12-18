<template>
  <!-- UI: MESSAGE -->
  <div
    :style="{ justifyContent: isSelf ? 'end' : 'start' }"
    class="ma-0 d-flex">
    <v-card
      :id="message._id"
      :class="`rounded-lg message message-${message.type.toLowerCase()}`"
      elevation="2"
      style="height: fit-content"
      color="primary">
      <v-card-title
        v-if="isShowingMessageName"
        class="font-weight-bold subtitle-1 pa-3 pt-2 pb-0">
        {{ senderName }}
      </v-card-title>

      <ChatMessageText
        v-if="message.type === 'TEXT'"
        :class="isShowingMessageName ? 'pt-0' : ''"
        :message="message" />
      <ChatMessageImage
        v-else-if="message.type === 'IMAGE'"
        :message="message" />
      <ChatMessageVideo
        v-else-if="message.type === 'VIDEO'"
        :message="message" />
      <ChatMessageAudio
        v-else-if="message.type === 'AUDIO'"
        :message="message" />
      <ChatMessageFile v-else :message="message" />
      <v-card-actions class="justify-end pt-0">
        <span class="text--secondary text-caption">{{ timestamp }}</span>
        <span class="text--secondary text-caption" v-if="selfClass === 'self'">
          {{ messageStatus }}
        </span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { Chat } from '@/classes/chat';
import { formatTime } from '@/utils';
import ChatMessageText from '@/components/message/ChatMessageText';
import ChatMessageImage from '@/components/message/ChatMessageImage';
import ChatMessageVideo from '@/components/message/ChatMessageVideo';
import ChatMessageAudio from '@/components/message/ChatMessageAudio';
import ChatMessageFile from '@/components/message/ChatMessageFile';

export default {
  name: 'ChatMessage',
  components: {
    ChatMessageVideo,
    ChatMessageImage,
    ChatMessageText,
    ChatMessageAudio,
    ChatMessageFile,
  },
  data() {
    return {
      page: 1,
    };
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    chat: {
      type: Chat,
      required: true,
    },
  },
  methods: {},
  computed: {
    isShowingMessageName() {
      return this.chat.isGroup && !this.isSelf;
    },
    maxChars() {
      return 500;
    },
    isSelf() {
      return this.$props.message.sender === this.$store.getters.user._id;
    },
    selfClass() {
      return this.isSelf ? 'self' : '';
    },
    timestamp() {
      const time = this.isSelf
        ? this.$props.message.sentAt
        : this.$props.message.deliveredAt;
      return formatTime(time);
    },
    senderName() {
      if (this.$props.chat.isGroup) {
        const sender = this.$props.chat.members.find(
          (member) => member._id === this.$props.message.sender
        );
        return sender.name;
      }

      console.error(
        'this function should never be reached',
        this.$props.message
      );
      return '';
    },
    messageStatus() {
      if (this.$props.message.seen?.length > 1) return 'seen';
      if (this.$props.message.deliveredAt !== null) return 'delivered';
      if (this.$props.message.sentAt !== null) return 'sent';
      return 'pending';
    },
  },
};
</script>

<style scoped>
.message {
  max-width: 70% !important;
}
.message-image,
.message-video {
  width: 400px !important;
}
.message-audio {
  width: 300px !important;
}
@media only screen and (max-width: 600px) {
  .message {
    max-width: 75% !important;
  }
  /*.message-image {*/
  /*  width: 70%!important;*/
  /*}*/
}
</style>
