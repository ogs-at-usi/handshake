<template>
  <v-menu offset-y top>
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
    </template>
    <v-list color="secondary" flat style="cursor: pointer">
      <v-list-item-group color="secondary">
        <v-list-item @click="sendImage">
          <v-list-item-title>Send image</v-list-item-title>
          <input
            id="file1"
            ref="fileImage"
            accept="image/*"
            style="display: none"
            hidden
            type="file"
            @change="onFileChange($event, 'image')" />
        </v-list-item>
        <v-list-item @click="sendVideo">
          <v-list-item-title>Send video</v-list-item-title>
          <input
            id="file2"
            ref="fileVideo"
            accept="video/*"
            hidden
            style="display: none"
            type="file"
            @change="onFileChange($event, 'video')" />
        </v-list-item>
        <v-list-item @click="sendAudio">
          <v-list-item-title>Send audio</v-list-item-title>
          <input
            id="file3"
            ref="fileAudio"
            accept="audio/*"
            hidden
            style="display: none"
            type="file"
            @change="onFileChange($event, 'audio')" />
        </v-list-item>
        <v-list-item @click="sendFile">
          <v-list-item-title>Send file</v-list-item-title>
          <input
            id="file3"
            ref="fileFile"
            accept="*"
            hidden
            style="display: none"
            type="file"
            @change="onFileChange($event, 'file')" />
        </v-list-item>
        <v-list-item @click="sendPosition">
          <v-list-item-title>Send position</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'MessageAttach',
  props: {
    chatId: {
      type: String,
    },
  },
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    async getChatId() {
      return (
        this.chatId ??
        (await this.$api.createChatIfNotExist(
          this.chatId,
          this.$store.getters.activeChat.members[0]._id
        ))
      );
    },
    sendImage() {
      this.$refs.fileImage.click();
    },
    sendVideo() {
      this.$refs.fileVideo.click();
    },
    sendAudio() {
      this.$refs.fileAudio.click();
    },
    sendFile() {
      this.$refs.fileFile.click();
    },
    getPosition() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (positionError) => reject(positionError),
            {
              enableHighAccuracy: true,
              timeout: 5000,
            }
          );
        } else {
          alert('Your browser does not support geolocation');
          reject(new Error('support'));
        }
      });
    },
    async sendPosition() {
      const chatId = await this.getChatId();
      try {
        const position = await this.getPosition();
        console.log(position);
        this.$gtag.event('message', {
          type: 'position',
        });
        await this.$api.sendPosition(
          chatId,
          position.coords.latitude,
          position.coords.longitude
        );
      } catch (e) {
        console.error(e);
      }
    },
    async onFileChange(e, type) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      const chatId = await this.getChatId();
      this.$gtag.event('message', {
        type,
      });
      await this.$api.sendFile(chatId, files[0], type);
    },
  },
};
</script>

<style scoped></style>
