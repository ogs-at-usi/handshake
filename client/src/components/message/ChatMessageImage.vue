<template>
  <div class="pa-1">
    <v-img :src="image" class="rounded" contain></v-img>
  </div>
</template>

<script>
import { getFilePath } from '@/utils';

export default {
  name: 'ChatMessageImage.vue',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    image() {
      return getFilePath('images', this.message.content);
    },
  },
};
</script>

<style scoped></style>
