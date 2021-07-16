const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  // dev server outputs bundled file in contentBase directory, but where you define in output property
  devServer: {
    contentBase: __dirname,
    hot: true,
    historyApiFallback: true,
    port: 8888
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("intg-dev"),
      OWNER_BUCKET_NAME: JSON.stringify("bactivityhair.com-dev-bucket"),
      CHECKOUT_SESSION_TIMEOUT: JSON.stringify("60000"),
      API1_URL: JSON.stringify("http://localdev.com:8080"),
      PUBLIC_IMAGE_PATH: JSON.stringify("/images/"),
      RECAPTCHA_SITE_KEY: JSON.stringify("6LcT32UbAAAAAPkBTDRWFyPfYhd6rN-9JhtUQCLg"),
    })
  ]
}); 
