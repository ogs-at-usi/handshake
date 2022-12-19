<template>
  <span>{{ message.content }}</span>
</template>

<script>
export default {
  name: 'ChatMessagePosition',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
