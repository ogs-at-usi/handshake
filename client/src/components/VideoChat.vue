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
          <v-btn color="error" @click="toggleEsc" fab>
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

    connectToNewUser(userId, stream) {
      const myPeer = this.$peer;
      console.log(this.$peer.id);
      // call the other user and send the
      const call = myPeer.call(userId, stream);
      const video = document.createElement('video');
      video.setAttribute('id', userId);

      call.on('stream', (userVideoStream) => {
        this.addVideoStream(video, userVideoStream, false);
      });
      call.on('close', () => {
        video.remove();
      });
    },
    addVideoStream(video, stream, myvideo = false) {
      const videoGrid = this.$refs['video-grid'];
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      if (!myvideo) {
        video.classList.add('videoOther');
      }
      // add class to video
      videoGrid.append(video);
    },
    // function to add the video of the user
    myVideo(chatId) {
      const myVideo = document.getElementById('you');
      const socket = this.$store.getters.socket;
      const myPeer = this.$peer;
      // const chatId = this.$props.chat._id;
      myVideo.muted = true;


      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          this.addVideoStream(myVideo, stream, true);

          myPeer.on('call', (call) => {
            call.answer(stream);
            const video = document.createElement('video');
            console.log('ANSWERING CALL');
            // call the other user and send the
            call.on('stream', (userVideoStream) => {
              this.addVideoStream(video, userVideoStream);
            });
          });

          socket.on('user-connected', (userId, chatId) => {
            console.log('USER CONNECTED');
            this.connectToNewUser(userId, stream);
          });

          socket.on('user-disconnected', (userId) => {
            socket.emit('leave-room', chatId, myPeer.id);
          });


          socket.on('otherUser-disconnected', (userId) => {
            console.log('OTHER USER DISCONNECTED');

            const video = document.getElementById(userId);
            video.remove();
          });
        });


    },
    otherVideo() {

    },
    buttonBar() {

    },
    toggleCamera() {
      this.camera = !this.camera;
      this.$refs.you.srcObject.getVideoTracks()[0].enabled = this.camera;

    },
    toggleMicrophone() {
      this.microphone = !this.microphone;
      this.$refs.you.srcObject.getAudioTracks()[0].enabled = this.microphone;

    },
    toggleEsc() {
      this.dialog = false;
      this.$store.commit('setCalling', {roomId: null});
    },
  },
  mounted() {
    const socket = this.$store.getters.socket;
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
