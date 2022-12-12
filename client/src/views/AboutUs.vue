<template>
  <v-container class="pa-0 justify-space-around d-flex flex-column" fluid>
    <div
      class="primary d-flex flex-row justify-space-between align-center pa-3">
      <h1 class="white--text">HandShake</h1>
      <v-btn color="white" outlined>About us</v-btn>
    </div>
    <section
      id="aboutus"
      class="d-flex flex-row justify-space-around align-center text-center flex-wrap gap-3 mt-8">
      <section class="col-12 col-md-5">
        <h1 class="text-h1 font-weight-bold primary--text">Hand<br />Shake</h1>
        <p>Connecting the world, one Shake at a time.</p>
      </section>
      <section class="col-12 col-md-5">
        <p class="text-h5 font-weight-bold">
          HandShake is a brand-new messaging service for everyone who is tired
          of the usual old chat apps. <br />Scroll down to learn more about us.
        </p>
      </section>

      <section class="col-11"></section>
      <section class="col-12 d-flex flex-row justify-center">
        <lottie-player
          id="lottie_scrolldown"
          ref="scrolldown"
          background="transparent"
          speed="1"
          src="/icons/scroll_down.json"
          style="width: 100px">
        </lottie-player>
      </section>

      <section class="col-12">
        <lottie-player
          id="lottie_handshake"
          ref="handshake"
          background="transparent"
          speed="1"
          src="/icons/handshake_anim.json"
          style="width: 100%">
        </lottie-player>
      </section>

      <section class="col-11 mb-10">
        <h1 class="text-h2">
          The messaging app for creative people, for fun people, for people who
          love sharing pictures of their pets.
        </h1>
      </section>

      <v-row
        class="ma-0 pa-0 d-flex flex-row justify-space-around align-center">
        <section class="col-12 col-sm-5">
          <lottie-player
            id="lottie_chatmessage"
            ref="chatmessage"
            background="transparent"
            speed="1"
            src="/icons/chatmessages.json"
            style="width: 100%">
          </lottie-player>
        </section>
        <section class="col-12 col-sm-6">
          <p class="text-h2 font-weight-bold mb-4">
            Connect with people around the world and start messaging now!
          </p>
          <p class="text-h4 mb-5 font-weight-bold">
            With HandShake, keeping in contact is as easy as ever.
          </p>
          <p class="text-h6">
            Text messages, pictures, videos, audio and documents: we got you!<br />
            Share the things you love with your family, friends and even with
            your enemies (we hope you don't have any).<br />
            We'll make sure the texts reach them, and that no one else will ever
            access them.<br />
            Voice calls and video calls will be supported in a future update.
          </p>
        </section>
      </v-row>

      <v-row
        class="pa-0 ma-0 d-flex justify-space-around flex-row mt-5 align-center">
        <section class="col-12 col-md-6 text-center text-md-start">
          <h1 class="display-2">
            A new generation of chat, for a new generation of users.
          </h1>
          <p class="text-h6 mt-5">Texting has never been more fun.</p>
          <p class="text-h6 mt-2">
            Play games directly in the chat and challenge your friends to see
            who the real MVP is.
          </p>
        </section>
        <section class="col-12 col-md-5">
          <lottie-player
            id="lottie_battle"
            ref="battle"
            background="transparent"
            speed="1"
            src="/icons/icon_battle.json"
            style="width: 100%">
          </lottie-player>
        </section>
      </v-row>

      <section class="col-11 mb-5">
        <h1 class="display-2">made with ♡ at USI by yours truly</h1>
      </section>
    </section>
    <footer id="login_page_footer" class="text-center">
      <p>
        made with ♡ by the
        <a
          class="link-light"
          href="https://github.com/ogs-at-usi/sa3-project"
          target="_blank"
          >ogs @ USI</a
        >
      </p>
    </footer>
  </v-container>
</template>

<script>
import '@lottiefiles/lottie-player';
import { create } from '@lottiefiles/lottie-interactivity';
export default {
  name: 'AboutUs',
  mounted() {
    this.$refs.scrolldown.addEventListener('load', () => {
      create({
        player: '#lottie_scrolldown',
        mode: 'scroll',
        actions: [
          {
            visibility: [0, 1],
            type: 'loop',
            frames: [0, 75],
          },
        ],
      });
    });
    this.$refs.handshake.addEventListener('load', () => {
      create({
        player: '#lottie_handshake',
        mode: 'scroll',
        actions: [
          {
            visibility: [0, 0.4],
            type: 'stop',
            frames: [0],
          },
          {
            visibility: [0.4, 0.7],
            type: 'seek',
            frames: [0, 60],
          },
          {
            visibility: [0.7, 1],
            type: 'seek',
            frames: [60, 96],
          },
        ],
      });
    });
    this.$refs.chatmessage.addEventListener('load', () => {
      create({
        player: '#lottie_chatmessage',
        mode: 'scroll',
        actions: [
          {
            visibility: [0, 0.2],
            type: 'stop',
            frames: [0],
          },
          {
            visibility: [0.2, 0.4],
            type: 'seek',
            frames: [0, 88],
          },
          {
            visibility: [0.4, 1],
            type: 'loop',
            frames: [0, 88],
          },
        ],
      });
    });
    this.$refs.battle.addEventListener('load', () => {
      create({
        player: '#lottie_battle',
        mode: 'chain',
        actions: [
          {
            frames: [0, 114],
            state: 'autoplay',
            reset: true,
            transition: 'onComplete',
          },
          {
            state: 'click',
            forceFlag: true,
            frames: [0, 114],
            transition: 'click',
            count: 5,
          },
        ],
      });
    });
  },
};
</script>

<style scoped>
.display-1 {
  font-weight: 900;
  font-size: 6rem;
}
#aboutus {
  overflow-y: auto;
}
.display-8 {
  font-size: 1.5rem;
}

* {
  font-family: 'Francois One', sans-serif;
}
</style>
