<template>
  <div id="chat" class="col-12 col-md-8 col-lg-9" v-if="chat !== null">
    <!-- image & name of the chat: other user image or group image -->
    <header class="d-flex flex-row gap-4 align-items-center">
      <img alt="pfp" class="pfp" src="/icons/default_pfp.png" />
      <h2 class="m-0 text-truncate">{{ chatName }}</h2>

      <!-- create a button that make apper a pop up -->
      <button class="bi bi-telephone" @click="callingFunction()"></button>

      <!-- popup -->
    </header>
    <!-- message container -->
    <main class="d-flex flex-column" ref="scroll">
      <ChatMessage
        v-for="(msg, index) in chat.messages"
        :key="index"
        :message="msg"
      ></ChatMessage>

      <div ref="video-grid"></div>
    </main>

    <!-- lower input bar for new message sending -->
    <footer class="d-flex row align-items-center justify-content-between">
      <form
        id="search-bar"
        class="d-flex flex-row align-items-center justify-space-between gap-3"
        @submit.prevent="sendMessage()"
      >
        <input
          ref="messageInput"
          type="text"
          name="message"
          placeholder="Type something..."
          class="flex-grow-1"
          v-model="messageString"
        />
        <button type="submit">💬</button>
      </form>
    </footer>
  </div>
</template>

<script>
import ChatMessage from '@/components/ChatMessage';
import Chat from '@/classes/chat';
import Message from '@/classes/message';

// Vue.use(VuePeerJS, new Peer());

export default {
  name: 'ChatBoard',
  components: { ChatMessage },
  data() {
    return {
      messageString: '',
      showPopup: false,
    };
  },
  props: {
    chat: {
      type: Chat,
      default: null,
    },
  },
  methods: {
    initForm: function (popup) {
      this[popup.hostElement.id] = popup;
    },
    scrollDown() {
      const e = this.$refs.scroll;
      e.scrollTop = e.scrollHeight;
    },
    onlySpaces(str) {
      return /^\s*$/.test(str);
    },

    async sendMessage() {
      if (this.onlySpaces(this.messageString)) {
        return;
      }

      let chatId = this.$props.chat._id;
      // if the chat does not exist we create a new one and get the save the id
      if (chatId === null) {
        const { data } = await this.$api.createChat(this.chat.members[0]._id);
        chatId = data._id; // way to unpack data apparently
      }

      // send the message using the chat id
      try {
        const msg = new Message({
          type: 'TEXT',
          content: this.messageString,
          sentAt: new Date(), // TODO: add sentAt implementation server side, field actually ignored
        });

        await this.$api.sendMessage(chatId, msg);
        // after sending it we reset the message box and scroll down
        this.messageString = '';
      } catch (err) {
        alert('Could not send the message. Check your internet connection');
        console.error(err);
      }
    },


      connectToNewUser(userId, stream) {

      const myPeer = this.$peer;
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









    async callingFunction() {
      const videoGrid = this.$refs['video-grid'];
      const socket = this.$store.getters.socket;
      const myPeer = this.$peer;
      let chatId = this.$props.chat._id;
      const peers = {};
      const myVideo = document.createElement('video');

      // create a bar to show the video buttons
      const videoBar = document.createElement('div');
      // put inside 3 buttons
      const videoButton = document.createElement('button');
      const audioButton = document.createElement('button');
      const endCallButton = document.createElement('button');
      // add class to the buttons
      videoButton.classList.add('videoButton');
      audioButton.classList.add('audioButton');
      endCallButton.classList.add('endCallButton');
      // add text to the buttons
      videoButton.innerHTML = 'Video';
      audioButton.innerHTML = 'Audio';
      endCallButton.innerHTML = 'End Call';
      // add the buttons to the bar
      videoBar.appendChild(videoButton);
      videoBar.appendChild(audioButton);
      videoBar.appendChild(endCallButton);
      // add class to the bar
      videoBar.classList.add('videoBar');
      videoGrid.appendChild(videoBar);

      addFunctionToButtons(videoButton, audioButton, endCallButton, myVideo);
      // add class yo myvideo
      myVideo.classList.add('myVideo');
      
 
      socket.emit('join-room', chatId, myPeer.id);



      myVideo.muted = true;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          this.addVideoStream(myVideo, stream, true);
          myPeer.on('call', (call) => {
            const answerCall = confirm ('Do you want to answer the call?');
            if (answerCall){ 
            call.answer(stream);
            const video = document.createElement('video');
            console.log('ANSWERING CALL');
            // call the other user and send the 
            call.on('stream', (userVideoStream) => {
              this.addVideoStream(video, userVideoStream);
            });
          } else {
            console.log('CALL REJECTED');
          }
          });

          socket.on('user-connected', (userId, chatId) => {
            console.log('USER CONNECTED');
            this.connectToNewUser(userId, stream);
          });

          socket.on('user-disconnected', (userId) => {
            console.log('USER DISCONNECTED');
            // if (peers[userId]) peers[userId].close();
            var videoTracks = stream.getVideoTracks();
            videoTracks.forEach(function (track) {
              track.stop();
            });

            var audioTracks = stream.getAudioTracks();
            audioTracks.forEach(function (track) {
              track.stop();
            });
            myVideo.remove();
            videoBar.remove();
            const video =  document.querySelector('video');
            video.remove();
          });


          socket.on('otherUser-disconnected', (userId) => {
            console.log('OTHER USER DISCONNECTED');

            const video = document.getElementById(userId);
            video.remove();
            
          });


        });

      // function connectToNewUser(userId, stream) {
      //   // call the other user and send the
      //   const call = myPeer.call(userId, stream);
      //   const video = document.createElement('video');
      //   video.setAttribute('id', userId);


      //   call.on('stream', (userVideoStream) => {  
      //     addVideoStream(video, userVideoStream, false);
      //   });
      //   call.on('close', () => {
      //     video.remove();
      //   });
      // }

      // function addVideoStream(video, stream, myvideo = false) {
      //   video.srcObject = stream;
      //   video.addEventListener('loadedmetadata', () => {
      //     video.play();
      //   });
      //   if (!myvideo) {
      //     video.classList.add('videoOther');
      //   }
      //   // add class to video
      //   videoGrid.append(video);
      // }

      function addFunctionToButtons(
        videoButton,
        audioButton,
        endCallButton,
        myVideo
      ) {
        videoButton.addEventListener('click', () => {
          if (myVideo.srcObject.getVideoTracks()[0].enabled) {
            myVideo.srcObject.getVideoTracks()[0].enabled = false;
            videoButton.innerHTML = 'Video Off';
          } else {
            myVideo.srcObject.getVideoTracks()[0].enabled = true;
            videoButton.innerHTML = 'Video';
          }
        });

        audioButton.addEventListener('click', () => {
          if (myVideo.srcObject.getAudioTracks()[0].enabled) {
            myVideo.srcObject.getAudioTracks()[0].enabled = false;
            audioButton.innerHTML = 'Audio Off';
          } else {
            myVideo.srcObject.getAudioTracks()[0].enabled = true;
            audioButton.innerHTML = 'Audio';
          }
        });

        endCallButton.addEventListener('click', () => {
          myVideo.srcObject.getVideoTracks()[0].enabled = false;
          myVideo.srcObject.getAudioTracks()[0].enabled = false;
          videoButton.innerHTML = 'Video Off';
          audioButton.innerHTML = 'Audio Off';
          myVideo.remove();
          // remove the bar
          videoBar.remove();


          // leave the room peer
          myPeer.destroy();
          
          socket.emit('leave-room', chatId, myPeer.id);
          // disable the permission for video and audio from navigator
        });
      }
    },
  },
  computed: {
    otherPrivateUser() {
      const [us1, us2] = this.chat.members;
      return us1._id !== this.$store.getters.user._id ? us1 : us2;
    },
    chatName() {
      if (this.$props.chat.isGroup) {
        return this.$props.chat.title;
      } else {
        return this.otherPrivateUser.name;
      }
    },
  },
  watch: {
    chat() {
      // updates when you click on a new chat
      this.$nextTick(() => {
        this.scrollDown();
        this.$refs.messageInput.focus();
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}

.myVideo {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  margin: 10px;
}

.otherVideo {
  width: 300px;
  height: 300px;
  border-radius: 10px;
  object-fit: cover;
  margin: 10px;
}

@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css');
</style>
