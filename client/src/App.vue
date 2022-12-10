<template>
  <v-app>
    <v-main class="m">
      <v-container
        v-if="hasLayout"
        class="flex-column h-100 d-flex flex-column pa-0 ma-0 surface--darken2"
        fluid
      >
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
import themes from './assets/vuetifyThemes';
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
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
  /*
  this colors are here just to prevent IDE to throw errors when using undefined css variables
  the following variables will be overridden by the vuetify theme
  */
  --v-textPrimary-base: #000000;
  --v-background-base: #000000;
  --v-surface-base: #000000;
  --v-primary-base: #000000;
  --v-secondary-base: #000000;
  --v-error-base: #000000;
  --v-accent-base: #000000;
}
* {
  box-sizing: border-box;
  color: var(--v-textPrimary-base);
}
p {
  margin: 0 !important;
}
.text-h1,
.text-h2,
.text-h3,
.text-h4,
h1,
h2,
h3,
h4 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800 !important;
}
.v-main {
  background: var(--v-background-base);
}
.v-main a {
  color: var(--v-accent-base) !important;
}
.v-main .v-list-item {
  transition: background 0.2s;
}
.v-main .v-item-group .v-list-item:hover:not(.v-list-item--active)::before {
  display: block;
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--v-accent-base);
  opacity: 0.1;
}
.v-main .v-input {
  color: white !important;
}
.v-main .v-input,
.v-main .v-input * {
  color: var(--v-textPrimary-base) !important;
}
.v-main .v-messages__message,
.v-application .error--text {
  color: var(--v-error-base) !important;
  caret-color: var(--v-error-base) !important;
}
.v-input.error--text fieldset {
  color: var(--v-error-base) !important;
}

.theme--light.v-application .text--primary {
  color: var(--v-textPrimary-base) !important;
}
.theme--light.v-application .text--secondary {
  color: var(--v-textPrimary-base) !important;
  filter: brightness(0.85);
}
.theme--dark.v-application .text--secondary {
  color: var(--v-textPrimary-base) !important;
  filter: brightness(1.3);
}

.mdi {
  color: var(--v-textPrimary-base) !important;
}

.v-divider.visible {
  background: var(--v-primary-base) !important;
  opacity: 0.2;
  filter: brightness(1.5);
}
</style>
