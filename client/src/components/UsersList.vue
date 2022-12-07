<template>
  <v-list-item v-if="users.length === 0">
    <v-list-item-content>
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
      <v-list-item-title v-else class="text--primary"
        >No users found</v-list-item-title
      >
    </v-list-item-content>
  </v-list-item>
  <v-list-item-group v-else-if="users.length > 0">
    <UserItem
      v-for="(user, index) in users"
      :key="index"
      :user="user"
      class="ps-4 py-3"
      @click.native="$emit('userSelected', user)"
    />
  </v-list-item-group>
</template>

<script>
import UserItem from '@/components/UserItem';
import User from '@/classes/user';

export default {
  name: 'UsersList',
  components: { UserItem },
  props: {
    filter: {
      type: String,
      default: '',
    },
  },
  data: function () {
    return {
      users: [],
      loading: true,
    };
  },
  methods: {
    async getUsers() {
      this.loading = true;
      const { data } = await this.$api.getUsers(this.filter);
      this.users = data.map((user) => new User(user));
      this.users = this.users.filter(
        (user) => user._id !== this.$store.getters.user._id
      );
      this.loading = false;
    },
  },
  mounted() {
    this.getUsers();
  },
  watch: {
    filter() {
      this.getUsers();
    },
  },
};
</script>

<style scoped></style>
