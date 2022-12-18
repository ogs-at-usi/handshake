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
            <v-icon :color="primaryColor + '!important'">mdi-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-dialog v-model="logout" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-list-item link v-bind="attrs" v-on="on">
            <v-list-item-icon class="mx-4">
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </template>

        <v-card color="secondary">
          <v-card-title class="text-h5 font-weight-bold"> Logout </v-card-title>

          <v-card-text class="text--primary">
            Are you sure you want to logout?
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="textPrimary" text @click="logout = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="textPrimary"
              outlined
              @click="
                () => {
                  this.logout = false;
                  this.$store.commit('logout');
                }
              ">
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        ['Vibe green', 'green', themesObject.green.primary],
        ['Cool orange', 'orange', themesObject.orange.primary],
        ['Warm pink', 'pink', themesObject.pink.primary],
        ['Fresh mint', 'mint', themesObject.mint.primary],
        ['Blooming rose', 'rose', themesObject.rose.primary],
      
      ],
      logout: false,
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
};
</script>

<style scoped></style>
