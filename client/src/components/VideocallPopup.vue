<template>
  <!-- content for the left hand side of the app main page -->
  <!-- about profile contact and image, search bar and contact chat list -->
  <div id="popupContainer">
    <v-dialog
      v-model="this.$store.getters.popup"
      eager
      persistent
      style="position: relative !important">
      <v-card>
        <v-card-title
          class="text-center font-weight-bold primary white--text elevation-7 pa-5 flex-row align-center justify-center d-flex"
          >{{ this.$store.getters.popup.chatName }} is calling you
        </v-card-title>

        <v-card-actions class="d-flex flex-row justify-center align-center">
          <v-btn class="elevation-7" color="success" @click="acceptCall"
            >Accept</v-btn
          >
          <v-btn class="elevation-7" color="error" @click="rejectCall"
            >Decline</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'VideocallPopup',
  methods: {
    acceptCall() {
      this.$store.dispatch('call', this.$store.getters.popup.roomId);
      this.$store.commit('setPopup', { chatName: null, roomId: null });
    },
    rejectCall() {
      this.$store.commit('setPopup', { chatName: null });
    },
  },
};
</script>

<style scoped>
.popup {
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 23px;
  right: 28px;
  width: 280px;
}
</style>
