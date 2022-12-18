<template>
  <!-- content for the left hand side of the app main page -->
  <!-- about profile contact and image, search bar and contact chat list -->
  <div>
    <v-card class="rounded-lg" elevation="10">
      <v-card-title
        class="text-center font-weight-bold primary text--primary pa-3 d-flex flex-row align-center justify-center"
        >{{ this.$store.getters.popup.chatName }} is calling you
      </v-card-title>

      <v-card-actions class="d-flex flex-row justify-center align-center pa-3">
        <v-btn color="success" @click="acceptCall"
          ><v-icon class="mr-3">mdi-phone</v-icon>Accept</v-btn
        >
        <v-btn color="error" @click="rejectCall"
          ><v-icon class="mr-3">mdi-phone-hangup</v-icon>Decline</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'VideocallPopup',
  methods: {
    acceptCall() {
      this.$store.dispatch('call', this.$store.getters.popup.roomId);
      this.$store.commit('setPopup', null);
    },
    rejectCall() {
      this.$store.commit('setPopup', null);
    },
  },
};
</script>

<style scoped></style>
