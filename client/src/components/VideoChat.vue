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
    <v-layout align-center fill-height justify-center row>
      <v-img
        ref="other"
        :aspect-ratio="16 / 9"
        max-height="100%"
        src="/icons/default_pfp.png"
        width="100%"></v-img>
      <v-img
        id="you"
        ref="you"
        :aspect-ratio="16 / 9"
        class="elevation-7"
        src="/icons/default_pfp.png"
        width="300px"></v-img>
      <v-toolbar
        absolute
        class="floatingbar"
        color="transparent"
        dense
        flat
        floating
        style="border-radius: 32px"
        width="auto">
        <v-layout class="gap-8" row>
          <v-btn
            :color="this.camera ? 'success' : 'error'"
            fab
            @click="toggleCamera">
            <v-icon v-if="this.camera">mdi-camera</v-icon>
            <v-icon v-else>mdi-camera-off</v-icon>
          </v-btn>
          <v-btn
            :color="this.microphone ? 'success' : 'error'"
            fab
            @click="toggleMicrophone">
            <v-icon v-if="this.microphone">mdi-microphone</v-icon>
            <v-icon v-else>mdi-microphone-off</v-icon>
          </v-btn>
          <v-btn color="error" fab>
            <v-icon>mdi-phone</v-icon>
          </v-btn>
        </v-layout>
      </v-toolbar>
    </v-layout>
  </v-dialog>
</template>

<script>
export default {
  name: 'VideoChat',

  data() {
    return {
      dialog: true,
      camera: true,
      microphone: true,
    };
  },

  methods: {
    // function to add the video of the user
    myVideo() {},
    otherVideo() {},
    buttonBar() {},
    toggleCamera() {
      this.camera = !this.camera;
    },
    toggleMicrophone() {
      this.microphone = !this.microphone;
    },
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
