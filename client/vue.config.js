const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  lintOnSave: false,
  outputDir: '../public',
  indexPath: 'index.html',
  devServer: {
    host: 'localhost',
    hot: 'only',
    devMiddleware: {
      publicPath: 'http://localhost:8888/',
      writeToDisk: true,
    },
  },
});
