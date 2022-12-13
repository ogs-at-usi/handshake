<template>
  <AudioPlayer :file="audio" />
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer';
import Message from '@/classes/message';
import { getFilePath } from '@/utils/message.utils';
export default {
  name: 'ChatMessageAudio',
  components: { AudioPlayer },
  props: {
    message: {
      type: Message,
      required: true,
    },
  },
  computed: {
    audio() {
      return getFilePath('audio', this.message.content);
    },
  },
};
</script>

<style scoped></style>
