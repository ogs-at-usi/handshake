<template>
  <div :id="" class="card">

    <div class="card-body">
      <h5 class="card-title">{{ }}</h5>
      <p class="card-text">Message text</p>
    </div>

    <p class="timestamp text-end">Timestamp</p>

  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
};
</script>

<style scoped>

</style>