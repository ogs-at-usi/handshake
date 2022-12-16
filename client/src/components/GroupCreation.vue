<template>
  <v-navigation-drawer
    v-model="opened"
    absolute
    color="surface"
    style="z-index: 90"
    temporary>
    <v-list class="pt-0 group_list d-flex flex-column h-100" flat>
      <v-list-item class="pt-2 secondary" style="height: 70px">
        <v-btn icon @click="opened = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-list-item-content class="ms-4">
          <v-list-item-title class="font-weight-bold">
            Create a new group
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="createGroup">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item class="pa-3">
        <v-text-field
          ref="groupName"
          v-model="groupName"
          :rules="[(v) => !!v || 'Group name is required']"
          color="colorPrimary"
          dense
          hide-details
          label="Group name"
          outlined
          required
          single-line></v-text-field>
      </v-list-item>
      <v-list-item style="min-height: min-content !important">
        <v-chip-group active-class="primary--text" center-active column>
          <v-chip
            v-for="user in selectedUsers"
            :key="user.id"
            :value="user.id"
            color="textPrimary"
            outlined
            style="max-width: 150px">
            <span class="text-truncate">{{ user.name }}</span>
          </v-chip>
        </v-chip-group>
      </v-list-item>
      <v-divider class="visible"></v-divider>
      <v-list-item class="pa-3 pb-0">
        <v-list-item-content class="py-0">
          <v-list-item-title class="font-weight-bold mt-2">
            Members
          </v-list-item-title>
          <v-text-field
            ref="search"
            v-model="search"
            class="mt-4"
            color="colorPrimary"
            dense
            filled
            hide-details
            label="Filter users"
            single-line></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <UsersList
        :filter="search"
        checkbox
        class="mt-4"
        style="overflow-y: auto; flex: 1 1 auto !important"
        :selectedUsers="selectedUsers"
        @userSelected="userSelected($event)" />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import UsersList from '@/components/UsersList';
import { Group } from '@/classes/group';

export default {
  name: 'GroupCreation',
  components: {
    UsersList,
  },
  data() {
    return {
      groupName: '',
      selectedUsers: [],
      search: '',
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    userSelected(user) {
      if (this.selectedUsers.includes(user)) {
        this.selectedUsers = this.selectedUsers.filter(
          (u) => u._id !== user._id
        );
      } else {
        this.selectedUsers.push(user);
      }
    },
    reset() {
      this.$refs.groupName.reset();
      this.selectedUsers = [];
    },
    async createGroup() {
      if (this.$refs.groupName.validate()) {
        const group = new Group({
          title: this.groupName,
          members: Array.from(this.selectedUsers),
        });
        await this.$api.createGroup(group);
        this.reset();
        this.opened = false;
      }
    },
  },
  computed: {
    opened: {
      get() {
        return this.open;
      },
      set(value) {
        this.$emit('setGroupOpen', value);
        this.reset();
      },
    },
  },
};
</script>

<style scoped>
.group_list > * {
  flex: 0 0 auto !important;
}
</style>
