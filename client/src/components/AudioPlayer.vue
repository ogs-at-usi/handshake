<template>
  <div class="d-flex flex-row justify-center align-center px-5 pt-4 gap-4">
    <v-btn
      :disabled="!loaded"
      color="textPrimary"
      icon
      outlined
      @click.native="playing ? pause() : play()">
      <v-icon v-if="!playing || paused" color="textPrimary">mdi-play</v-icon>
      <v-icon v-else color="textPrimary">mdi-pause</v-icon>
    </v-btn>
    <div class="flex-grow-1 align-center" style="position: relative">
      <v-progress-linear
        v-model="percentage"
        :disabled="!loaded"
        color="textPrimary"
        height="5"
        rounded
        style="cursor: pointer"
        @click.native="setPosition()"></v-progress-linear>
      <span
        class="caption text--secondary"
        style="position: absolute; left: 0; top: 8px"
        >{{ currentTime }} / {{ duration }}</span
      >
    </div>
    <audio
      id="player"
      ref="player"
      :src="file"
      hidden
      @ended="percentage = 0"></audio>
  </div>
</template>
<script>
// write a formatTime function that takes seconds an formats them as a string minutes:seconds
const formatTime = (s) => {
  const minutes = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export default {
  name: 'AudioPlayer',
  props: {
    file: {
      type: String,
      default: null,
    },
  },
  computed: {
    duration: function () {
      return this.audio ? formatTime(this.totalDuration) : '';
    },
  },
  data() {
    return {
      firstPlay: true,
      isMuted: false,
      loaded: false,
      playing: false,
      paused: false,
      percentage: 0,
      currentTime: '00:00',
      audio: undefined,
      totalDuration: 0,
    };
  },

  methods: {
    setPosition() {
      this.audio.currentTime = parseInt(
        (this.audio.duration / 100) * this.percentage
      );
    },
    play() {
      if (this.playing) return;
      this.audio.play().then((_) => (this.playing = true));
      this.paused = false;
    },
    pause() {
      this.paused = !this.paused;
      this.paused ? this.audio.pause() : this.audio.play();
    },
    _handleLoaded: function () {
      if (this.audio.readyState >= 2) {
        if (this.audio.duration === Infinity) {
          // Fix duration for streamed audio source or blob based
          // https://stackoverflow.com/questions/38443084/how-can-i-add-predefined-length-to-audio-recorded-from-mediarecorder-in-chrome/39971175#39971175
          this.audio.currentTime = 1e101;
          this.audio.ontimeupdate = () => {
            this.audio.ontimeupdate = () => {};
            this.audio.currentTime = 0;
            this.totalDuration = parseInt(this.audio.duration);
            this.loaded = true;
          };
        } else {
          this.totalDuration = parseInt(this.audio.duration);
          this.loaded = true;
        }

        if (this.autoPlay) this.audio.play();
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    _handlePlayingUI: function () {
      this.percentage = (this.audio.currentTime / this.audio.duration) * 100;
      this.currentTime = formatTime(this.audio.currentTime);
      this.playing = true;
    },
    _handlePlayPause: function (e) {
      if (e.type === 'play' && this.firstPlay) {
        // in some situations, audio.currentTime is the end one on chrome
        this.audio.currentTime = 0;
        if (this.firstPlay) {
          this.firstPlay = false;
        }
      }
      if (
        e.type === 'pause' &&
        this.paused === false &&
        this.playing === false
      ) {
        this.currentTime = '00:00:00';
      }
    },
    _handleEnded() {
      this.paused = this.playing = false;
    },
    init: function () {
      this.audio.volume = 0.1;
      this.audio.addEventListener('timeupdate', this._handlePlayingUI);
      this.audio.addEventListener('loadeddata', this._handleLoaded);
      this.audio.addEventListener('pause', this._handlePlayPause);
      this.audio.addEventListener('play', this._handlePlayPause);
      this.audio.addEventListener('ended', this._handleEnded);
    },
  },
  mounted() {
    this.audio = this.$refs.player;
    this.init();
  },
  beforeDestroy() {
    this.audio.removeEventListener('timeupdate', this._handlePlayingUI);
    this.audio.removeEventListener('loadeddata', this._handleLoaded);
    this.audio.removeEventListener('pause', this._handlePlayPause);
    this.audio.removeEventListener('play', this._handlePlayPause);
    this.audio.removeEventListener('ended', this._handleEnded);
  },
};
</script>
