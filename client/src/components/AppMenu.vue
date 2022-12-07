<template>
  <!-- MENU WITH OWN IMAGE, SEARCH BAR AND CONTACTS LIST -->
  <v-container class="pa-0 w-100 ma-0 h-100" fluid>
    <v-navigation-drawer clipped permanent width="100%">
      <v-list >
        <v-list-item>
          <v-list-item-avatar>
            <img alt="pfp" src='/icons/default_pfp.png' />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{$store.getters.user.name}}</v-list-item-title>
            <v-list-item-subtitle>{{$store.getters.user.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="pa-3">
          <v-text-field
            v-model="searchedUser"
            dense
            hide-details
            label="Search"
            outlined
            prepend-inner-icon="mdi-magnify"
            single-line
          ></v-text-field>
        </v-list-item>
        <v-divider></v-divider>
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
      </v-list>
    </v-navigation-drawer>
  </v-container>
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
