<template>
  <AudioPlayer :file="audio" />
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer';
import { getFilePath } from '@/utils';
export default {
  name: 'ChatMessageAudio',
  components: { AudioPlayer },
  props: {
    message: {
      type: Object,
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
