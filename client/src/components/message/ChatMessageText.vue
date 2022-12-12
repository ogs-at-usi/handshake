<template>
  <v-card-text class="pa-3 pb-1 text--primary" style='font-size:1.1rem;'>
    {{ content }}
    <a
      v-if="content.length < message.content.length"
      style="cursor: pointer"
      @click.prevent="page++">
      Show more
    </a>
  </v-card-text>
</template>

<script>
import Message from '@/classes/message';
const MAX_CHARS = 500;

export default {
  name: 'ChatMessageText',
  props: {
    message: {
      type: Message,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
    };
  },
  computed: {
    content() {
      return this.message.content.slice(0, MAX_CHARS * this.page);
    },
  },
};
</script>

<style scoped></style>
