<template>
  <v-navigation-drawer
    v-model="opened"
    absolute
    color="surface"
    style="z-index: 90"
    temporary>
    <v-list class="pt-0" flat>
      <v-list-item class="pt-2 secondary" style="height: 70px">
        <v-btn icon @click="opened = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-list-item-content class="ms-4">
          <v-list-item-title class="font-weight-bold">
            Create a new group
          </v-list-item-title>
        </v-list-item-content>
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
        <v-chip-group active-class="primary--text" center-active>
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
      <UsersList
        checkbox
        @usersSelected="selectedUsers = $event"
        class="mt-4"
        filter="w"
        style="height: 300px; overflow-y: scroll" />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import UsersList from '@/components/UsersList';
export default {
  name: 'GroupCreation',
  components: {
    UsersList,
  },
  data() {
    return {
      groupName: '',
      selectedUsers: [],
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    opened: {
      get() {
        return this.open;
      },
      set(value) {
        this.groupName = '';
        this.$refs.groupName.reset();
        this.$emit('setGroupOpen', value);
      },
    },
  },
  watch: {
    selectedUsers() {
      console.log(this.selectedUsers);
    },
  },
};
</script>

<style scoped></style>
