<template>
  <!-- MENU WITH OWN IMAGE, SEARCH BAR AND CONTACTS LIST -->
  <v-container class="pa-0 w-100 ma-0 h-100" fluid>
    <AppSettings v-if="openSettings" />
    <v-navigation-drawer clipped color="surface" permanent width="100%">
      <v-list class="pt-0" flat>
        <v-list-item class="pt-2 secondary">
          <v-list-item-avatar>
            <img alt="pfp" src="/icons/default_pfp.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{
              $store.getters.user.name
            }}</v-list-item-title>
            <v-list-item-subtitle class="text--secondary">{{
              $store.getters.user.email
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="openSettings">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item class="pa-3">
          <v-text-field
            v-model="searchedUser"
            dense
            hide-details
            label="Search"
            outlined
            prepend-inner-icon="mdi-magnify"
            single-line
            color="textPrimary"></v-text-field>
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn class="ms-2" icon @click="startCreateGroup" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-list color="secondary" style="cursor: pointer">
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-title>New group</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-divider class="visible"></v-divider>
        <ChatList v-if="searchedUser === ''" :chats="chats"></ChatList>
        <UsersList
          v-else
          :filter="searchedUser"
          @userSelected="searchedUser = ''"
          v-on="$listeners"></UsersList>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import ChatList from '@/components/ChatList.vue';
import UsersList from '@/components/UsersList';
import AppSettings from '@/components/AppSettings.vue';

export default {
  name: 'AppMenu',
  components: { AppSettings, UsersList, ChatList },
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
  methods: {
    startCreateGroup() {
      this.$emit('startCreateGroup');
    },
    openSettings() {
      this.$emit('openSettings');
    },
  },
};
</script>

<style scoped></style>
