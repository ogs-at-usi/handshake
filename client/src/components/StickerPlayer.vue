<template>
  <lottie-player
    :src="`/stickers/${sticker}.json`"
    background="transparent"
    speed="1"
    style="width: 100px; height: 100px" />
</template>

<script>
import '@lottiefiles/lottie-player';
export default {
  name: 'StickerPlayer',
  props: {
    sticker: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
