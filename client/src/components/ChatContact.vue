<template>
  <!-- UI: CONTACT -->
  <div class="contact justify-content-between d-flex flex-row align-items-center">

    <!-- image of the other user or group chat -->
    <div class="col-3">
      <img :src="`/media/${ other._id }.png`" class="pfp" alt="pfp" />
    </div>

    <!-- name of the other user or group chat -->
    <div class="col-8">
      <h3>{{ other.name }}</h3>
    </div>

    <!-- notification badge -->
    <div class="col-1">
      <p class="notification badge rounded-pill text-bg-light"></p>
    </div>

  </div>
</template>

<script>
import Chat from '../../public/js/classes/chat.js';

export default {
  name: 'ChatContact',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
