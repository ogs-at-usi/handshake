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
        id="login_form"
        class="d-flex flex-column position-relative col-12 col-xl-5 gap-2"
      >
        <h2>Already a user?</h2>
        <form class="text-center" @submit.prevent="login">
          <input
            name="username"
            type="text"
            placeholder="Username"
            v-model="username"
          />
          <div class="w-100"></div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            v-model="password"
          />
          <div class="w-100"></div>
          <button class="btn btn-outline-light .mx-auto" type="submit">
            Log in
          </button>
        </form>
        <p>
          Don't have an account?
          <a class="btn .mx-auto" href="/signup"> Sign up </a>
        </p>
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
  name: 'AuthLogin',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
        });
        await this.$router.push('/');
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
a {
  color: #fffa;
}
</style>
