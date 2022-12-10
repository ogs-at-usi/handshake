<template>
  <section class="flex-grow-1 justify-center align-center d-flex">
    <v-card color="transparent" elevation="0">
      <v-form ref="form" @submit.prevent="login">
        <v-card-title class="justify-center pb-7">
          <h2>Login</h2>
        </v-card-title>
        <v-card-text class="pb-3 d-flex flex-column gap-3">
          <v-text-field
            v-model="username"
            :error="errors !== ''"
            color="textPrimary"
            hide-details
            label="Username"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="errors"
            :hide-details="errors === ''"
            :type="showPassword ? 'text' : 'password'"
            color="textPrimary"
            label="Password"
            outlined
            required
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" large type="submit" :loading="loading"
            >Login</v-btn
          >
        </v-card-actions>
        <v-card-actions class="justify-center">
          <span
            >Don't have an account?
            <router-link to="/signup">Sign up</router-link></span
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </section>
</template>

<script>
export default {
  name: 'AuthLogin',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      errors: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      // write an array with 3 numbers
      this.loading = true;
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
        });
        await this.$router.push('/');
      } catch (err) {
        this.errors = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
