<template>
  <!-- MENU WITH OWN IMAGE, SEARCH BAR AND CONTACTS LIST -->
  <section id="menu" class="col-12 col-md-4 col-lg-3">
    <!-- UI: HANDSHAKE TITLE & USER IMAGE -->
    <header
      id="title_user_image"
      class="justify-content-between align-items-center d-flex flex-row"
    >
      <h1>HandShake</h1>
      <!-- user profile image href insertion -->
      <!-- TODO: recognize whether the user as an image or not (POST request) -->
      <img :src="'icons/default_pfp.png'" class="pfp" alt="pfp" />
    </header>

    <!-- UI: SEARCH BAR TEXT & BUTTON -->
    <nav id="searchbar" class="align-items-center d-flex flex-row">
      <form id="search-bar">
        <input v-model="searchedUser" type="text" placeholder="Search..." />
        <button @click="search()">🔎</button>
      </form>
    </nav>

    <!-- UI: CONTACTS -->
    <ChatList v-if="searchedUser === ''" :chats='chats'></ChatList>
    <!-- TODO: add v-else -->
  </section>
</template>

<script>
import ChatList from '@/components/ChatList.vue'

export default {
  name: 'AppMenu',
  components: { ChatList },
  data: function () {
    return {
      chats: [],
      searchedUser: '',
    };
  },
  methods: {
    async search() {
      console.log(`Searching matching users: ${this.searchedUser}`);
      // const matchingUsers = await this.$api.getUsers(this.searchedUser);
      // do stuff with the result creating a new component popup to show matches
    },
  },
  computed: {
  },
};
</script>

<style scoped></style>
