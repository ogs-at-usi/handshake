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
            @change="onFileChange($event, 'image')"
          />
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
            @change="onFileChange($event, 'video')"
          />
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
            @change="onFileChange($event, 'file')"
          />
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'FileUploader',
  props: {
    chatId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    sendImage() {
      this.$refs.fileImage.click();
    },
    sendVideo() {
      this.$refs.fileVideo.click();
    },
    sendFile() {
      this.$refs.fileFile.click();
    },
    onFileChange(e, type) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.$api.sendFile(this.chatId, files[0], type);
    },
  },
};
</script>

<style scoped></style>
