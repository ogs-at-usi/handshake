const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  outputDir: '../server/public',
  indexPath: './index.html',
  devServer: {
    host: 'localhost',
    hot: 'only',
    devMiddleware: {
      publicPath: 'http://localhost:8888/',
      writeToDisk: true,
    },
  },
});
