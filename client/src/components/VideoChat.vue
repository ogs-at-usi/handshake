<template>
  <v-dialog
    v-model="dialog"
    content-class="pa-5"
    eager
    fullscreen
    max-width="80%"
    no-click-animation
    persistent
    style="position: relative !important">
    <v-layout align-center class="ma-0" fill-height justify-center row>
      <!-- other user video incoming chat in page -->
      <video
        id="other"
        ref="other"
        :aspect-ratio="16 / 9"
        :src-object.prop.camel="otherStream"
        src="/icons/default_pfp.png"
        style="object-fit: contain; max-height: 100%; width: 100%"
        @loadedmetadata="$refs.other.play()"></video>

      <!-- user video outgoing chat in bottom right corner -->
      <video
        id="you"
        ref="you"
        :aspect-ratio="16 / 9"
        :src-object.prop.camel="myStream"
        class="elevation-7"
        muted
        src="/icons/default_pfp.png"
        width="300px"
        @loadedmetadata="$refs.you.play()" />
      <v-snackbar
        v-model="lagging"
        :top="true"
        absolute
        color="error darken-2"
        timeout="-1">
        <v-icon left>mdi-alert-circle</v-icon>
        <span>The connection is bad, you might experience lag.</span>
      </v-snackbar>
      <v-snackbar v-model="errors.video" absolute color="error darken-2" top>
        <v-icon left>mdi-alert-circle</v-icon>
        <span>
          Could not enable the video, make sure that your camera is working.
        </span>
      </v-snackbar>
      <v-snackbar
        v-model="errors.microphone"
        absolute
        color="error darken-2"
        top>
        <v-icon left>mdi-alert-circle</v-icon>
        <span>
          Could not enable the audio, make sure that your microphone is working.
        </span>
      </v-snackbar>
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
          <!-- enable/disable webcam -->
          <v-btn
            :color="this.camera ? 'success' : 'error'"
            fab
            @click="toggleCamera">
            <v-icon v-if="this.camera">mdi-camera</v-icon>
            <v-icon v-else>mdi-camera-off</v-icon>
          </v-btn>

          <!-- enable/disable microphone -->
          <v-btn
            :color="this.microphone ? 'success' : 'error'"
            fab
            @click="toggleMicrophone">
            <v-icon v-if="this.microphone">mdi-microphone</v-icon>
            <v-icon v-else>mdi-microphone-off</v-icon>
          </v-btn>

          <!-- exit from video call -->
          <v-btn color="error" fab @click="quitCall">
            <v-icon>mdi-phone</v-icon>
          </v-btn>
        </v-layout>
      </v-toolbar>
    </v-layout>
  </v-dialog>
</template>

<script>
const LAG_THRESHOLD = 20;
export default {
  name: 'VideoChat',

  data() {
    return {
      dialog: true, // show the popup dialog of video chat
      camera: true,
      microphone: true,
      otherStream: null,
      myStream: null,
      call: null,
      lagging: false,
      lagInterval: null,
      errors: {
        microphone: false,
        video: false,
      },
    };
  },

  methods: {
    /**
     *  function to add the video of the user
     */
    async initCall() {
      const socket = this.$store.getters.socket;
      const myPeer = this.$peer;
      const storeCall = this.$store.getters.calling;

      socket.emit('videochat:join', ...storeCall.eventData);
      myPeer.on('call', async (call) => {
        this.myStream = await this.askMediaPermission();
        call.answer(this.myStream);
        this.call = call;
        this.checkLag(call);
        call.on('stream', (userStream) => (this.otherStream = userStream));
        call.on('close', () => {

          this.quitCall();
          console.log('call closed with ' + call.peer);

        });

        console.log('call', call);

      });

      socket.on('videochat:joined', (userId) => {
        console.log('Other user connected');
        this.otherConnected(userId);
      });

      socket.on('videochat:left', () => {
        console.log('Other user disconnected');
        this.quitCall();
      });
    },
    /**
     * function to add the video of the other user
     * @param userId
     */
    otherConnected(userId) {
      const myPeer = this.$peer;
      const call = myPeer.call(userId, this.myStream);
      console.log('Calling ' + userId);
      call.on('stream', async (userStream) => (this.otherStream = userStream));
      this.checkLag(call);
      this.call = call;

      call.on('close', () => {
        this.quitCall();
        console.log('call closed with ' + call.peer);

      });
    },
    /**
     * function to toggle the webcam
     */
    toggleCamera() {
      try{
        this.myStream.getVideoTracks()[0].enabled = !this.camera;
        this.camera = !this.camera;

      }
      catch(e){
        this.errors.video = true;
      }
    },
    toggleMicrophone() {
      try {

        this.myStream.getAudioTracks()[0].enabled = !this.microphone;
        this.microphone = !this.microphone;

      } catch (e) {
        this.errors.microphone = true;
      }
    },
    quitCall() {

      this.dialog = false;

      this.$store.getters.socket.off('videochat:joined');
      this.$store.getters.socket.off('videochat:left');

      this.$store.getters.socket.emit('videochat:quit');
      this.$store.commit('setCalling', null);


      if (this.call) {
        this.call.close();
        this.call = null;
      }
      clearInterval(this.lagInterval);
      this.otherStream?.getTracks()?.forEach((track) => {
        track?.stop();
      });
      this.myStream?.getTracks()?.forEach((track) => {
        track?.stop();
      });

    },
    checkLag(call) {
      let overTimes = 0;
      let underTimes = 0;
      this.lagInterval = setInterval(() => {
        call.peerConnection.getStats().then((stats) => {
          stats.forEach((stat) => {
            if (
              stat.totalRoundTripTime &&
              stat.totalRoundTripTime > LAG_THRESHOLD
            ) {
              overTimes += 1;
              underTimes = 0;
            } else {
              underTimes += 1;
              overTimes = 0;
            }
            if (overTimes > 5) {
              this.lagging = true;
            } else if (underTimes > 5) {
              this.lagging = false;
            }
          });
        });
      }, 1000);
    },
    askMediaPermission() {
      return navigator.mediaDevices.getUserMedia({
        video: this.camera,
        audio: this.microphone,
      });
    },
    async checkAvailableMedia() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      const audioDevices = devices.filter(
        (device) => device.kind === 'audioinput'
      );

      if (videoDevices.length === 0) this.camera = false;
      if (audioDevices.length === 0) this.microphone = false;
    },
  },
  async mounted() {
    if (
      this.$store.getters.popup &&
      this.$store.getters.popup.roomId === this.$store.getters.calling.roomId
    ) {
      this.$store.commit('setPopup', null);
    }

    await this.checkAvailableMedia();
    this.myStream = await this.askMediaPermission().then (async (stream) => {
      await this.initCall();
      return stream;
    }).catch((e) => {
      console.log(e);
      this.quitCall();
    });
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
