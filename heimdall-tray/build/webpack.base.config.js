'use strict';

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
  return {
    target: "node",
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      }
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: (env === "production") ? [
      new UglifyJSPlugin({
        sourceMap: false
      }),
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" })
    ] : [
      new UglifyJSPlugin({
        sourceMap: false
      }),
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" })
    ]
  };
};
