<template>
  <v-navigation-drawer
    v-model="opened"
    color="surface"
    temporary
    absolute
    style="z-index: 100">
    <v-list class="pt-0" flat>
      <v-list-item class="pt-2 secondary" style="height: 70px">
        <v-btn icon @click="opened = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-list-item-content class="ms-4">
          <v-list-item-title class="font-weight-bold">
            Settings
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-switch
        class="ms-6"
        :input-value="$store.state.allowNotifications"
        @change="$store.commit('setNotifications', $event)"
        label="Notifications"></v-switch>
      <v-list-group :value="false" no-action sub-group>
        <template #activator>
          <v-list-item-title>Themes</v-list-item-title>
        </template>
        <v-list-item
          v-for="([title, themeKey, primaryColor], i) in themes"
          :key="i"
          link
          @click="setTheme(themeKey)">
          <v-list-item-icon :style="{ color: primaryColor }">
            <v-icon :color="primaryColor + '!important'">mdi-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import themesObject from '@/assets/vuetifyThemes';
export default {
  name: 'AppSettings',
  data() {
    return {
      switch1: false,
      themes: [
        ['Dark blue', 'blue', themesObject.blue.primary],
        ['Vibe green', 'green', themesObject.green.primary],
        ['Cool orange', 'orange', themesObject.orange.primary],
        ['Warm pink', 'pink', themesObject.pink.primary],
      ],
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
        this.$emit('setSettings', value);
      },
    },
  },
  methods: {
    setTheme(theme) {
      this.$vuetify.theme.themes.light = themesObject[theme];
      this.$store.commit('setTheme', { theme });
    },
  },
  async created() {
    await this.$store.restored;
  },
};
</script>

<style scoped></style>
