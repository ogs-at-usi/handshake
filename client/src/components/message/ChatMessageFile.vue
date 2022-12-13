<template>
  <v-row class="pa-5 pb-0 ma-0 flex-row align-center gap-3 flex-nowrap">
    <v-btn color="textPrimary" icon outlined @click="download">
      <v-icon class="pa-0" color="textPrimary">mdi-download</v-icon>
    </v-btn>
    <span class="description-2 text--secondary text-truncate">
      {{ message.content }}
    </span>
  </v-row>
</template>

<script>
import Message from '@/classes/message';
import { getFilePath } from '@/utils/message.utils';
export default {
  name: 'ChatMessageFile',
  props: {
    message: {
      type: Message,
      required: true,
    },
  },
  methods: {
    download() {
      const fileURL = getFilePath('files', this.message.content);
      const link = document.createElement('a');
      link.setAttribute('href', fileURL);
      link.setAttribute('download', this.message.content);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped></style>
