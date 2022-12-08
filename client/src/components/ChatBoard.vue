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

      <div class="popup" v-if="showPopup">
        <div class="video-grid"></div>
      </div>
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
// import VuePeerJS from 'vue-peerjs'




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

    callingFunction() {


      const videoGrid = this.$refs['video-grid'];
      const socket = this.$store.getters.socket;

      const myPeer = this.$peer;

      
      let chatId = this.$props.chat._id;

      socket.emit('joinCall', chatId);
      console.log('join-call');

      const myVideo = document.createElement('video');
      myVideo.muted = true;
      const peers = {};
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          addVideoStream(myVideo, stream);

          myPeer.on('call', (call) => {
            console.log('call');
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
              addVideoStream(video, userVideoStream);
            });
          });

          socket.on('user-connected', (userId) => {
            connectToNewUser(userId, stream);
          });
        });



      socket.on('user-disconnected', (userId) => {
        if (peers[userId]) peers[userId].close();
      });

      myPeer.on('open', (id) => {
        socket.emit('join-room', chatId, id);
      });

      function connectToNewUser(userId, stream) {
        const call = myPeer.call(userId, stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
        call.on('close', () => {
          video.remove();
        });

        peers[userId] = call;
      }

      function addVideoStream(video, stream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
        videoGrid.append(video);
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
  mounted() {



  },
};
</script>

<style scoped>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css');
</style>
