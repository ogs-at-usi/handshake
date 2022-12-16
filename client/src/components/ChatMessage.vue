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
        v-if="!isSelf && isGroup"
        class="font-weight-regular subtitle-1 pa-3 pb-0"
        >{{ senderName }}</v-card-title
      >

      <ChatMessageText v-if="message.type === 'TEXT'" :message="message" />
      <ChatMessageImage
        v-else-if="message.type === 'IMAGE'"
        :message="message" />
      <ChatMessageVideo
        v-else-if="message.type === 'VIDEO'"
        :message="message" />
      <ChatMessageAudio
        v-else-if="message.type === 'AUDIO'"
        :message="message" />
      <ChatMessageFile v-else-if="message.type === 'FILE'" :message="message" />
      <StickerPlayer
        v-else-if="message.type === 'STICKER'"
        :sticker="message?.content"
        animate-on-click />
      <v-card-actions class="justify-end pt-0">
        <span class="text--secondary text-caption">{{ timestamp }}</span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Message from '@/classes/message';
import { formatTime } from '@/utils';
import ChatMessageText from '@/components/message/ChatMessageText';
import ChatMessageImage from '@/components/message/ChatMessageImage';
import ChatMessageVideo from '@/components/message/ChatMessageVideo';
import ChatMessageAudio from '@/components/message/ChatMessageAudio';
import ChatMessageFile from '@/components/message/ChatMessageFile';
import StickerPlayer from '@/components/StickerPlayer';

export default {
  name: 'ChatMessage',
  components: {
    ChatMessageVideo,
    ChatMessageImage,
    ChatMessageText,
    ChatMessageAudio,
    ChatMessageFile,
    StickerPlayer,
  },
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
      return formatTime(time);
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
