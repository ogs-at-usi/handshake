<template>
  <!-- UI: CONTACT -->
  <div class="contact justify-content-between d-flex flex-row align-items-center gap-4">

    <!-- image of the other user or group chat -->
    <div>
      <img :src="imageId" class="pfp" alt="pfp" />
    </div>

    <!-- name of the other user or group chat -->
    <div class="flex-grow-1">
      <h3 class='m-0'>{{ name }}</h3>
    </div>

    <!-- notification badge -->
    <div class="d-none">
      <p class="notification badge rounded-pill text-bg-light"></p>
    </div>

  </div>
</template>

<script>
import Chat from '@/classes/chat'
import Group from '@/classes/group'

export default {
  name: 'ChatContact',
  props: {
    chat: {
      type: Chat,
      required: true,
    },
  },
  computed: {
    otherPrivateUser() {
      const [us1, us2] = this.chat.members;
      return us1._id !== this.$store.getters.user._id ? us1 : us2;
    },
    imageId() {
      if (this.chat instanceof Group) return this.chat._id;
      else {
        // TODO: check if the user has an image with a axios HTTP request
        // then if exist, return this.otherPrivateUser._id;
        return 'icons/default_pfp.png';
      }
    },
    name() {
      if (this.chat.isGroup) return this.chat.title;
      else return this.otherPrivateUser.name;
    },
  },
};
</script>

<style scoped>

</style>
