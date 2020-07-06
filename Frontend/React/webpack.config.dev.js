const baseConfig = require('./webpack.config.base');
const path = require('path');

module.exports = baseConfig.merge({
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000
  },
  watch: true,
  devtool: 'inline-source-map'
});