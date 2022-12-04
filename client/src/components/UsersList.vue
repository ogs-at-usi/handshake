<template>
  <div v-if='loading' class='spinner-border' role='status'>
    <span class='visually-hidden'>Loading...</span>
  </div>
  <main v-else-if='users.length > 0' class='menu_list'>
    <UserItem v-for='(user, index) in users' :key='index' :user='user' />
  </main>
  <main v-else class='menu_list'>
    <h3>No users found</h3>
  </main>
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
  data: function() {
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
      this.users = this.users.filter((user) => user._id !== this.$store.getters.user._id);
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
