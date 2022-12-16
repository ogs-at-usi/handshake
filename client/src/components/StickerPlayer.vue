<template>
  <lottie-player
    :src="`/stickers/${sticker}.json`"
    background="transparent"
    speed="1"
    ref="sticker"
    style="width: 100px; height: 100px" />
</template>

<script>
import '@lottiefiles/lottie-player';
import { create } from '@lottiefiles/lottie-interactivity';
export default {
  name: 'StickerPlayer',
  props: {
    sticker: {
      type: String,
      required: true,
    },
    animateLoop: {
      type: Boolean,
      default: false,
    },
    animateOnClick: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$refs.sticker.addEventListener('load', () => {
      const actions = [];
      if (this.animateLoop) {
        actions.push({
          state: 'loop',
          transition: 'none',
          count: this.animateLoop ? 1 : 0,
        });
      } else {
        actions.push({
          type: 'click',
          forceFlag: false,
        });
      }
      create({
        player: this.$refs.sticker,
        mode: this.animateLoop ? 'chain' : 'cursor',
        actions,
      });
    });
  },
};
</script>

<style scoped></style>
