<template>
  <div>
    <div id="title" class="align-items-center justify-content-between">
      <h1>HandShake</h1>
      <h2><a class="btn btn-outline-light" href="">About us</a></h2>
    </div>

    <section
      id="login"
      class="d-flex row justify-content-evenly align-items-center text-center"
    >
      <section
        id="signup_form"
        class="d-flex flex-column position-relative col-12 col-xl-5 gap-2"
      >
        <h2>Join HandShake now.</h2>

        <form class="text-center" @submit.prevent="signup">
          <input
            name="username"
            type="text"
            placeholder="Username"
            v-model="username"
          />
          <input
            name="email"
            type="text"
            placeholder="E-mail"
            v-model="email"
          />
          <div class="w-100"></div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            v-model="password"
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
            v-model="password2"
          />
          <div class="w-100"></div>

          <button class="btn btn-outline-light .mx-auto" type="submit">
            Sign up
          </button>
        </form>
      </section>
    </section>
    <footer id="login_page_footer" class="text-center">
      <p>
        made with ♡ by the
        <a
          class="link-light"
          href="https://github.com/ogs-at-usi/sa3-project"
          target="_blank"
          >ogs @ USI</a
        >
      </p>
    </footer>
  </div>
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
    };
  },
  methods: {
    signup() {
      if (this.password !== this.password2) {
        alert('Passwords do not match');
        return;
      }
      this.$api
        .signup(this.email, this.username, this.password)
        .then(() => {
          this.$router.push('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped></style>
