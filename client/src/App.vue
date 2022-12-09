<template>
  <v-app>
    <v-main class='m'>
      <v-container v-if='hasLayout' class="flex-column h-100 d-flex flex-column pa-0 ma-0 surface--darken2" fluid>
        <div
          class="primary d-flex flex-row justify-space-between align-center pa-3"
        >
          <h1 class="white--text">HandShake</h1>
          <v-btn color="white" outlined>About us</v-btn>
        </div>
        <router-view></router-view>
        <footer class="d-flex justify-center align-center pa-3">
          <p class="font-weight-bold">
            made with ♡ by the
            <a href="https://github.com/ogs-at-usi/sa3-project" target="_blank"
            >ogs @ USI</a
            >
          </p>
        </footer>
      </v-container>
      <router-view v-else></router-view>
    </v-main>
  </v-app>
</template>

<script>
import themes from "./assets/vuetifyThemes";
export default {
  name: 'App',
  computed: {
    hasLayout() {
      return this.$route.meta?.layout;
    },
  },
  methods: {
    setTheme(theme) {
      this.$vuetify.theme.themes.light = themes[theme];
    },
  },
  created() {
    this.setTheme('blue');
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
p {
  margin: 0!important;
}
html {
  overflow-y: auto!important;
}
* {
  color: var(--v-textOnPrimary-base);
}
.v-main {
  background:var(--v-background-base);
}
.v-main .v-input {
  color: white!important;
}
.v-main .v-input * {
  color: white!important;
}
.v-main .v-messages__message {
  color: var(--v-error-base)!important;
}
.v-main .v-navigation-drawer {
  background: var(--v-surface-base)!important;
}

.theme--light.v-application .text--primary {
  color: var(--v-textPrimary-base)!important
}
.theme--light.v-application .text--secondary {
  color: var(--v-textOnPrimary-base)!important;
  filter: brightness(0.7);
}
.theme--dark.v-application .text--secondary {
  color: var(--v-textOnPrimary-base)!important;
  filter: brightness(1.3);
}

.mdi {
  color: var(--v-textPrimary-base)!important;
}
</style>
