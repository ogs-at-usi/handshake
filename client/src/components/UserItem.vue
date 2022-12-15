<template>
  <v-list-item class="py-2 gap-3" color="primary">
    <template v-slot:default="{ active }">
      <!-- image of the other user or group chat -->
      <v-list-item-avatar class="mr-0">
        <img alt="pfp" class="pfp" src="/icons/default_pfp.png" />
      </v-list-item-avatar>

      <!-- name of the other user or group chat -->
      <v-list-item-content>
        <v-list-item-title class="text--primary font-weight-bold">
          {{ user.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="text--secondary">
          {{ user.email }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action v-if="checkbox">
        <v-checkbox :input-value="active" color="primary"></v-checkbox>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script>
import { User } from '@/classes/user';

export default {
  name: 'UserItem',
  props: {
    user: {
      type: User,
      required: true,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
