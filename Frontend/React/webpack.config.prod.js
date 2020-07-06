const baseConfig = require('./webpack.config.base');
const path = require('path');

module.exports = baseConfig.merge({
  mode: 'production'
});