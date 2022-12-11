<template>
  <v-navigation-drawer
    v-model="opened"
    color="surface"
    temporary
    absolute
    style="z-index: 100">
    <v-list class="pt-0" flat>
      <v-list-item class="pt-2 secondary">
        <v-list-item-avatar>
          <img alt="pfp" src="/icons/default_pfp.png" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            {{ $store.getters.user.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="visible"></v-divider>
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="item.action">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppSettings',
  data() {
    return {
      items: [
        { title: 'Themes', icon: 'mdi-cog', action: () => {} },
        { title: 'Logout', icon: 'mdi-logout', action: () => {} },
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
};
</script>

<style scoped></style>
