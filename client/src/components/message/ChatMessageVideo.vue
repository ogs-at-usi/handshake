<template>
  <div class="pa-1">
    <video :src="video" class="w-100" controls preload="none" />
  </div>
</template>

<script>
import Message from '@/classes/message';
import { getFilePath } from '@/utils/message.utils';

export default {
  name: 'ChatMessageVideo',
  props: {
    message: {
      type: Message,
      required: true,
    },
  },
  computed: {
    video() {
      return getFilePath('videos', this.message.content);
    },
  },
};
</script>

<style scoped></style>
