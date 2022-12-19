<template>
  <v-card color="primary" flat>
    <v-img :src="mapSource">
      <v-card-title class='background--text'> Position </v-card-title>
    </v-img>
    <v-card-actions>
      <v-btn color="textPrimary" text @click="openMaps">
        <v-icon color="textPrimary" left>mdi-map</v-icon>
        Open in Maps
      </v-btn>
    </v-card-actions>
  </v-card>
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
  methods: {
    openMaps: function () {
      const [latitude, longitude] = this.message.content.split(',');
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        '_blank'
      );
    },
  },
  computed: {
    mapSource() {
      // TODO change this asap since exposing the API key is not a good idea lol
      const [latitude, longitude] = this.message.content.split(',');
      const zoom = 14;
      const geoJSON = `%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B${longitude}%2C${latitude}%5D%7D`;
      return `https://api.mapbox.com/styles/v1/dallem/clbumaq8x007u14n5p78fx2ib/static/geojson(${geoJSON})/${longitude},${latitude},${zoom},0,0/300x200?access_token=pk.eyJ1IjoiZGFsbGVtIiwiYSI6ImNsYnVrOWlyMDBkdWszb21zanhsanVlMG8ifQ.9w5olmHecKqGOnJM2O59KA`;
    },
  },
};
</script>

<style scoped></style>
