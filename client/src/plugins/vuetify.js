import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        surface: '#c5c5c5',
        textOnPrimary: '#ffffff',
        textOnAccent: '#000000',
      },
      dark: {
        text: '#ffffff',
        primary: '#00528c',
        secondary: '#0d3f62',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        surface: '#162d3d',
        background: '#0f1d27',
      },
    },
  },
});
