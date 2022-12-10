<template>
  <section class="flex-grow-1 justify-center align-center d-flex">
    <v-card color="transparent" elevation="0">
      <v-form ref="form" lazy-validation @submit.prevent="signup">
        <v-card-title class="justify-center pb-7">
          <h2>Sign Up</h2>
        </v-card-title>
        <v-card-text class="pb-3 d-flex flex-column gap-3">
          <v-text-field
            v-model="username"
            color="textPrimary"
            label="Username"
            :error-messages="errors.username"
            :rules="[(v) => !!v || 'Username is required']"
            hide-details="auto"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            :error-messages="errors.email"
            :rules="[
              (v) => !!v || 'Email is required',
              (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
            ]"
            color="textPrimary"
            hide-details="auto"
            label="Email"
            outlined
            required
          />
          <v-divider />
          <v-text-field
            v-model="password"
            :error-messages="errors.password"
            color="textPrimary"
            label="Password"
            hide-details="auto"
            type="password"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password2"
            :error-messages="errors.password2"
            :rules="[
              () => (password === password2 ? true : 'Passwords do not match'),
            ]"
            color="textPrimary"
            hide-details="auto"
            label="Confirm Password"
            outlined
            required
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" large type="submit">Sign Up</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </section>
</template>

<script>
export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      password2: '',
      errors: {
        username: '',
        email: '',
        password: '',
        password2: '',
      },
    };
  },
  methods: {
    signup() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.$api
        .signup(this.email, this.username, this.password)
        .then(() => {
          this.$router.push('/login');
        })
        .catch((err) => {
          if (!err.response) return;
          /*
          The response is gonna be something like:
          {"username":["A user with that username already exists."],"email":["user with this email address already exists."]}
           */
          const { data } = err.response;
          for (const [key, value] of Object.entries(data)) {
            this.errors[key] = value;
          }
        });
    },
  },
};
</script>

<style scoped>
a {
  color: #fffa;
}
input {
  padding: 12px 20px;
  margin: 8px;
  display: inline-block;
}
</style>
