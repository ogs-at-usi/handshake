<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    max-width="300px"
    offset-y
    top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-sticker-emoji</v-icon>
      </v-btn>
    </template>

    <v-card class="pa-3 overflow-auto" color="primary" max-height="400px">
      <v-row>
        <v-col
          v-for="(sticker, index) in stickers"
          :key="index"
          class="d-flex justify-center align-center"
          cols="6">
          <v-btn
            color="transparent"
            elevation="0"
            height="auto"
            @click="sendSticker(sticker)">
            <StickerPlayer :sticker="sticker" animate-loop icon />
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
import '@lottiefiles/lottie-player';
import StickerPlayer from '@/components/StickerPlayer';
export default {
  name: 'EmojiPicker',
  components: { StickerPlayer },
  props: {
    chatId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      menu: false,
      stickers: ['happy', 'sad', 'stare', 'tired', 'what'],
    };
  },
  methods: {
    async sendSticker(stickerName) {
      this.menu = false;
      const newChatId =
        this.chatId ||
        (await this.$api.createChatIfNotExist(
          this.chatId,
          this.$store.getters.activeChat.members[0]._id
        ));
      this.$gtag.event('message', {
        type: 'sticker',
        sticker: stickerName,
      });
      await this.$api.sendSticker(newChatId, stickerName);
    },
  },
};
</script>

<style scoped></style>
