const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: './src/index.tsx', 
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("production"),
      CHECKOUT_SESSION_TIMEOUT: JSON.stringify("600000"), // 10 mins
      API1_URL: JSON.stringify("https://api.iwaodev.com"),
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'all',
    },
  }
}); 
