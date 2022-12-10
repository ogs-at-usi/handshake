<template>
  <v-menu offset-y top>
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
    </template>
    <v-list color="secondary" style="cursor: pointer">
      <v-list-item-group color="secondary">
        <v-list-item>
          <v-list-item-title @click="sendImage">Send image</v-list-item-title>
          <input
            id="file1"
            ref="fileImage"
            accept="image/*"
            style="display: none"
            type="file"
            @change="onFileChange($event, 'image')"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title @click="sendVideo">Send video</v-list-item-title>
          <input
            id="file2"
            ref="fileVideo"
            accept="video/*"
            style="display: none"
            type="file"
            @change="onFileChange($event, 'video')"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title @click="sendFile">Send file</v-list-item-title>
          <input
            id="file3"
            ref="fileFile"
            accept="*"
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
      console.log(files[0], type);
    },
  },
};
</script>

<style scoped></style>
