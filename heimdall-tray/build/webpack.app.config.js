'use strict';

const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");

module.exports = env => {
  return merge(base(env), {
    entry: {
      'background': "./src/background.js",
      'getopenssl': "./src/getopenssl.js",
      'heimdall': "./src/heimdall.js",
      'thread': "./src/thread.js",
      'settings': "./src/settings.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../app")
    }
  });
};
