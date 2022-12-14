<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="80%"
    no-click-animation
    style="position: relative !important"
    eager
    fullscreen
    content-class="pa-5">
    <v-img
      src="/icons/default_pfp.png"
      width="100%"
      max-height="100%"
      :aspect-ratio="16 / 9"></v-img>
    <v-img
      id="you"
      src="/icons/default_pfp.png"
      width="300px"
      class="elevation-7"
      :aspect-ratio="16 / 9"></v-img>
    <v-toolbar
      width="auto"
      absolute
      dense
      floating
      flat
      color="transparent"
      class="floatingbar"
      style="border-radius: 32px">
      <v-layout row class="gap-8">
        <v-btn fab color="primary">
          <v-icon>mdi-camera</v-icon>
        </v-btn>
        <v-btn fab color="primary">
          <v-icon>mdi-microphone</v-icon>
        </v-btn>
        <v-btn fab color="primary">
          <v-icon>mdi-phone</v-icon>
        </v-btn>
      </v-layout>
    </v-toolbar>
  </v-dialog>
</template>

<script>
export default {
  name: 'VideoChat',

  data() {
    return {
      dialog: true,
    };
  },

  methods: {
    // function to add the video of the user
    myVideo() {},
    otherVideo() {},
    buttonBar() {},
  },
};
</script>

<style scoped>
.floatingbar {
  top: calc(100% - 32px);
  left: 50%;
  transform: translate(-50%, -100%);
}
#you {
  position: absolute;
  bottom: 32px;
  right: 32px;
}
.video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /*grid-template-rows: 1fr 1fr;*/
  grid-template-areas:
    'myVideo-grid other-grid'
    'button-bar button-bar';
  height: 100vh;
  width: 100vw;
  background-color: #000;
}

.myVideo-grid {
  display: flex;

  justify-content: center;
  align-items: center;
  background-color: #fff;
  height: 100%;
  width: 100%;
}

.myVideo {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.videoOther {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
