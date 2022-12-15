<template>
  <!-- menu user image, search bar and contacts list -->
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
      <v-list class="pt-0" flat>
        <!-- user image, name, email and settings icon -->
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
        <!-- search bar and create group options -->
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

          <!-- x cancel button to cancel group creation -->
          <v-btn
            class="ms-2"
            icon
            v-if="groupCreation"
            @click="defaultGroupData">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <!-- check button to confirm group creation -->
          <v-btn class="ms-2" icon v-if="groupCreation" @click="createGroup">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-list-item>
        <!-- contacts (chats) or user (search) list -->
        <v-divider class="visible" />

        <!-- group title visible only when creating a group -->
        <v-text-field
          v-if="groupCreation"
          v-model="groupTitle"
          label="Group Title"
          dense
          hide-details
          outlined
          prepend-inner-icon="md-text-short"
          single-line
          color="textPrimary" />

        <ChatList v-if="searchedUser === '' && !groupCreation" :chats="chats" />
        <!-- with groupCreation, it becomes multi selectable -->
        <UsersList
          v-else-if="!groupCreation"
          :filter="searchedUser"
          :groupCreation="groupCreation"
          @userSelected="searchedUser = ''"
          v-on="$listeners" />

        <!-- group creation list -->
        <v-list-item-group v-if="groupCreation" multiple>
          <template v-for="(user, i) in groupUsersSearch">
            <v-divider v-if="!user" :key="`divider-${i}`"></v-divider>

            <v-list-item
              v-else
              :key="`item-${i}`"
              :value="user"
              active-class="deep-purple--text text--accent-4">
              <template v-slot:default="{ active }">
                <v-list-item-content>
                  <v-list-item-title v-text="user.name" />
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox
                    :input-value="active"
                    @click="clickedUser(user, active)"
                    color="deep-purple accent-4" />
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import ChatList from '@/components/ChatList';
import UsersList from '@/components/UsersList';
import AppSettings from '@/components/AppSettings';
import { User } from '@/classes/user';
import { Group } from '@/classes/group';
import GroupCreation from '@/components/GroupCreation';

export default {
  name: 'AppMenu',
  components: { GroupCreation, AppSettings, UsersList, ChatList },
  data: function () {
    return {
      searchedUser: '',
      openSettings: false,
      groupCreation: false,
      groupUsers: new Set(),
      groupTitle: '',
      groupUsersSearch: [],
      openGroups: false,
    };
  },
  props: {
    chats: {
      type: Array,
    },
  },
  methods: {
    defaultGroupData() {
      this.groupCreation = false;
      this.groupUsers.clear();
      this.groupTitle = '';
      this.groupUsersSearch = [];
    },
    startGroupCreation() {
      this.groupCreation = true;
      this.getUsers();
    },
    /**
     * pop up a dialog to create a new group where you can add a title and
     * search for users to add to the group.
     */
    async createGroup() {
      console.log('create group', Array.from(this.groupUsers));
      this.groupTitle = this.groupTitle.replace(' ', '');
      if (this.groupTitle === '' || this.groupUsers.size === 0) return;
      const group = new Group({
        title: this.groupTitle,
        members: Array.from(this.groupUsers),
      });
      await this.$api.createGroup(group);
      this.defaultGroupData();
    },
    async getUsers() {
      const { data } = await this.$api.getUsers(this.searchedUser);
      this.groupUsersSearch = data.map((user) => new User(user));
      this.groupUsersSearch = this.groupUsersSearch.filter(
        (u) => u._id !== this.$store.getters.user._id
      );
    },
    clickedUser(user, active) {
      const realStatus = !active;
      console.log('clicked user', user, realStatus);
      if (realStatus) {
        this.groupUsers.add(user);
      } else {
        if (this.groupUsers.has(user)) this.groupUsers.delete(user);
      }
      console.log('group users', this.groupUsers);
    },
  },
  watch: {
    searchedUser() {
      if (this.groupCreation) this.getUsers();
    },
  },
};
</script>

<style scoped></style>
