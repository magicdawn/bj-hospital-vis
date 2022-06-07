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
    const isProd = process.env.NODE_ENV === 'production'

    const PROD = {
      externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
      },
      js: [
        'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
        'https://cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
        'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
      ],
    }

    config.externals = {
      'mapbox-gl': 'mapboxgl',
      'lodash': '_',
      'moment': 'moment',
      ...(isProd ? PROD.externals : {}),
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
          ...(isProd ? PROD.js : []),
        ],
      })
    )
  },
}
