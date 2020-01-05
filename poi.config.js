const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlExternalWebpackPlugin = require('html-external-webpack-plugin')

module.exports = {
  babel: {
    transpileModules: [/@magicdawn\/x\/(?!node_modules)/],
  },

  devServer: {
    open: false,
  },

  configureWebpack(config) {
    // config.devtool = '#inline-source-map'
    config.devtool = false

    config.externals = {
      'mapbox-gl': 'mapboxgl',
      'lodash': '_',
      'moment': 'moment',
    }

    config.plugins.push(
      new HtmlExternalWebpackPlugin({
        HtmlWebpackPlugin,
        context: __dirname,
        css: [
          'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css',
          'https://cdn.jsdelivr.net/npm/mapbox-gl@1.6.1/dist/mapbox-gl.css',
          'https://cdn.jsdelivr.net/npm/github-markdown-css@3.0.1/github-markdown.min.css',
        ],
        js: [
          'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
          'https://cdn.jsdelivr.net/npm/moment@2.24.0/moment.min.js',
          'https://cdn.jsdelivr.net/npm/mapbox-gl@1.6.1/dist/mapbox-gl.min.js',
        ],
      })
    )
  },
}
