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
      <!-- TODO: recognize whether the user as an image or not -->
      <img class="pfp" :src="'icons/default_pfp.png'" alt="pfp" />
    </header>

    <!-- UI: SEARCH BAR TEXT & BUTTON -->
    <nav id="searchbar" class="align-items-center d-flex flex-row">
      <form id="search-bar">
        <input v-model="searchedUser" type="text" placeholder="Search..." />
        <button @click="search()">🔎</button>
      </form>
    </nav>

    <!-- UI: CONTACTS -->
    <main id="contacts">
      <ChatContact v-for="(chat, index) in chats"
                   :key="index"
                   :id="`chat${index}`"
                   :chat="chat" >
      </ChatContact>
    </main>

  </section>
</template>

<script>
import ChatContact from '@/components/ChatContact.vue';

export default {
  name: 'ContactList',
  components: { ChatContact },
  data: function () {
    return {
      contacts: [],
      searchedUser: '',
    };
  },
  methods: {
    async search() {
      console.log(`Searching matching users: ${this.searchedUser}`);
      // eslint-disable-next-line no-unused-vars
      const matchingUsers = await this.$api.getUsers(this.searchedUser);
      // do stuff with the result creating a new component popup to show matches
    },
  },
};
</script>

<style scoped></style>
