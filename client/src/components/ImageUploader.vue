<template>
  <v-img
    :src="`/upload/avatar/${$store.getters.user._id}?u=${update}`"
    alt="pfp"
    class="your_pfp"
    @click="$refs.propicImage.click()">
    <input
      id="propicfile"
      ref="propicImage"
      accept="image/*"
      hidden
      style="display: none"
      type="file"
      @change="uploadPropic($event)" />
  </v-img>
</template>

<script>
export default {
  name: 'ImageUploader',
  data() {
    return { update: 0 };
  },
  created() {
    console.log(this.$store.getters.user._id);
  },
  methods: {
    async uploadPropic(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      try {
        await this.$api.uploadProfilePicture(files[0]);
        // refresh the v-img component
        this.update++;
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.your_pfp {
  transition: all 0.3s ease-in-out;
}
.your_pfp:hover {
  cursor: pointer;
  filter: brightness(0.6);
}
</style>
