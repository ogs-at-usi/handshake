<template>
  <v-container class="pa-0 w-100 ma-0 h-100" fluid style="position: relative">
    <AppSettings
      class="w-100"
      @setSettings="openSettings = $event"
      :open="openSettings" />
    <GroupCreation
      :open="openGroups"
      class="w-100"
      @setGroupOpen="openGroups = $event" />
    <v-navigation-drawer clipped color="surface" permanent width="100%">
      <v-list
        class="pt-0 d-flex flex-column"
        flat
        style="height: 100vh !important">
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
            <v-btn icon @click="openSettings = true">
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
            color="textPrimary" />

          <v-btn class="ms-2" icon @click="openGroups = true">
            <v-icon>mdi-account-multiple-plus</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider class="visible" />
        <ChatList
          v-if="searchedUser === ''"
          :chats="chats"
          class="flex-fill overflow-y-auto" />
        <!-- with groupCreation, it becomes multi selectable -->
        <UsersList
          v-else
          :filter="searchedUser"
          @userSelected="searchedUser = ''"
          class="flex-fill overflow-y-auto"
          v-on="$listeners" />
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import ChatList from '@/components/ChatList';
import UsersList from '@/components/UsersList';
import AppSettings from '@/components/AppSettings';
import GroupCreation from '@/components/GroupCreation';

export default {
  name: 'AppMenu',
  components: { GroupCreation, AppSettings, UsersList, ChatList },
  data: function () {
    return {
      searchedUser: '',
      openSettings: false,
      openGroups: false,
    };
  },
  props: {
    chats: {
      type: Array,
    },
  },
};
</script>

<style scoped>
.v-list-item {
  flex: 0 0 auto !important;
}
</style>