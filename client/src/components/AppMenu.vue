<template>
  <!-- MENU WITH OWN IMAGE, SEARCH BAR AND CONTACTS LIST -->
  <section id="menu" class="col-12 col-md-4 col-lg-3">
    <!-- UI: HANDSHAKE TITLE & USER IMAGE -->
    <header
      id="title_user_image"
      class="justify-content-end align-items-center d-flex flex-row-reverse gap-3"
    >
      <h1 class='m-0 p-0'>HandShake</h1>
      <!-- user profile image href insertion -->
      <!-- TODO: recognize whether the user has an image or not (POST request) -->
      <img :src="'icons/default_pfp.png'" alt="pfp" class="pfp" />
    </header>

    <!-- UI: SEARCH BAR TEXT & BUTTON -->
    <nav id="searchbar" class="align-items-center d-flex flex-row">
      <form id="search-bar" class="d-flex flex-row-reverse gap-2 alig-items-center" @click.prevent=''>
        <input
          v-model="searchedUser"
          class="flex-grow-1"
          placeholder="Search..."
          type="text"
        />
        <span class='d-flex align-items-center justify-content-center'>🔎</span>
      </form>
    </nav>

    <!-- UI: CONTACTS -->
    <ChatList
      v-if="searchedUser === ''"
      :chats="chats"
      v-on="$listeners"
    ></ChatList>
    <UsersList
      v-else
      :filter="searchedUser"
      @userSelected="searchedUser = ''"
      v-on="$listeners"
    ></UsersList>
  </section>
</template>

<script>
import ChatList from '@/components/ChatList.vue';
import UsersList from '@/components/UsersList';

export default {
  name: 'AppMenu',
  components: { UsersList, ChatList },
  data: function () {
    return {
      searchedUser: '',
    };
  },
  props: {
    chats: {
      type: Array,
    },
  },
};
</script>

<style scoped></style>
