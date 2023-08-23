const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
      }),
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    ],
    resolve: {
      fallback: {
        crypto: false,
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        assert: false,
        util: false,
        http: false,
        https: false,
        os: false,
      },
    },
  });
};
