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
            ●
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
      themes: [
        ['Dark blue', 'blue', themesObject.blue.primary],
        ['Dark green', 'green', themesObject.green.primary],
        ['Cool orange', 'orange', themesObject.orange.primary],
        ['Warm pink', 'pink', themesObject.pink.primary],
      ],
    };
  },
  computed: {
    opened: {
      get() {
        return true;
      },
      set(value) {
        this.$emit('setSettings', value);
      },
    },
  },
  methods: {
    setTheme(theme) {
      this.$vuetify.theme.themes.light = themesObject[theme];
    },
  },
};
</script>

<style scoped></style>
