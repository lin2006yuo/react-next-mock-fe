const webpack = require('webpack')
const withLess = require("@zeit/next-less")
const withCss = require("@zeit/next-css")
module.exports = withCss(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true
    },
    webpack: config => {
      config.module.rules.push({
        test: /\.(ttf|eot|svg|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      })
      return config
    }
  })
)
