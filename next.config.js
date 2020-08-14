const webpack = require('webpack')
const withLess = require("@zeit/next-less")
const withCss = require("@zeit/next-css")
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

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
      config.resolve.alias = {
        'common': resolve('src/common'),
        'components': resolve('src/components'),
        'api': resolve('src/api'),
        ...config.resolve.alias
      }
      return config
    }
  })
)
