<template>
  <div id='chat_board'>
    <header>
      <!-- image & name of the chat: other user image or group image -->
      <img class="pfp" src="icons/default_pfp.png" alt="pfp" />
      <h2>{{ chat instanceof Group ? chat.title : otheruser.name }}</h2>
    </header>

    <main class="d-flex flex-column">
      <!-- append messages inside here -->
    </main>

    <footer class="d-flex row align-items-center justify-content-between">
      <form id="search-bar" action="">
        <input type="text" name="message" placeholder="Write something..." class="col-9"/>
        <button>💬</button>
      </form>
    </footer>
  </div>
</template>

<script>
import Chat from '@/classes/chat'
// eslint-disable-next-line no-unused-vars
import Group from '@/classes/group'

export default {
  name: 'ChatBoard',
  props: {
    chat: {
      type: Chat,
      required: true,
    }
  }
};
</script>

<style scoped>

</style>