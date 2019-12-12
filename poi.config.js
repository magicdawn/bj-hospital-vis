const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlExternalWebpackPlugin = require('html-external-webpack-plugin')

module.exports = {
  babel: {
    transpileModules: [/@magicdawn\/x/],
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
          'https://cdn.jsdelivr.net/npm/mapbox-gl@1.6.0/dist/mapbox-gl.css',
        ],
        js: ['lodash', 'mapbox-gl', 'moment'],
      })
    )
  },
}
