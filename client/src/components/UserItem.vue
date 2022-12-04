<template>
  <div
    class="contact justify-content-between d-flex flex-row align-items-center gap-4"
  >
    <!-- image of the other user or group chat -->
    <div>
      <img alt="pfp" class="pfp" src="/icons/default_pfp.png" />
    </div>

    <!-- name of the other user or group chat -->
    <div class="flex-grow-1">
      <h3>{{ user.name }}</h3>
    </div>

    <!-- notification badge -->
    <div>
      <p class="notification badge rounded-pill text-bg-light"></p>
    </div>
  </div>
</template>

<script>
import User from '@/classes/user';

export default {
  name: 'UserItem',
  props: {
    user: {
      type: User,
      required: true,
    },
  },
};
</script>

<style scoped></style>
