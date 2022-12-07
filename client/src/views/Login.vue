<template>
  <v-row class="flex-column h-100 ma-0 surface--darken2">
    <div
      class="primary d-flex flex-row justify-space-between align-center pa-3"
    >
      <h1 class="white--text">HandShake</h1>
      <v-btn color="white" outlined>About us</v-btn>
    </div>
    <section class="flex-grow-1 justify-center align-center d-flex">
      <v-card color="transparent" elevation="0">
        <v-form ref="form" @submit.prevent='login' >
          <v-card-title class="justify-center pb-7">
            <h2>Login</h2>
          </v-card-title>
          <v-card-text class="pb-3 d-flex flex-column gap-3">
            <v-text-field
              v-model="username"
              :error="errors !== ''"
              color="text"
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
              color="text"
              label="Password"
              outlined
              required
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="text" outlined type='submitg'>Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </section>
    <footer class="d-flex justify-center align-center pa-3">
      <p class="font-weight-bold">
        made with ♡ by the
        <a href="https://github.com/ogs-at-usi/sa3-project" target="_blank"
          >ogs @ USI</a
        >
      </p>
    </footer>
  </v-row>
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
    };
  },
  methods: {
    async login() {
      // write an array with 3 numbers
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
        });
        await this.$router.push('/');
      } catch (err) {
        this.errors = err.response.data.message;
      }
    },
  },
};
</script>

<style scoped></style>
