const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  // dev server outputs bundled file in contentBase directory, but where you define in output property
  devServer: {
    contentBase: __dirname,
    hot: true,
    historyApiFallback: true,
    host: "localdev.com",
    disableHostCheck: true,
    port: 3000,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("development"),
      //TEST_ADMIN_USER_ID: JSON.stringify("e95bf632-1518-4bf2-8ba9-cd8b7587530b"),
      //TEST_ADMIN_EMAIL: JSON.stringify("test_admin@test.com"),
      //TEST_MEMBER_USER_ID: JSON.stringify("c7081519-16e5-4f92-ac50-1834001f12b9"),
      //TEST_MEMBER_EMAIL: JSON.stringify("test_member@test.com"),
      //TEST_USER_PASSWORD: JSON.stringify("test_password"),
      OWNER_BUCKET_NAME: JSON.stringify("bactivityhair.com-dev-bucket"),
      CHECKOUT_SESSION_TIMEOUT: JSON.stringify("60000"),
      API1_URL: JSON.stringify("http://localdev.com:8080"),
      API1_DOMAIN: JSON.stringify("localdev.com:8080"),
      PUBLIC_IMAGE_PATH: JSON.stringify("/images/"),
      RECAPTCHA_SITE_KEY: JSON.stringify(
        "6LcT32UbAAAAAPkBTDRWFyPfYhd6rN-9JhtUQCLg"
      ),
    }),
  ],
});
