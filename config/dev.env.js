'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PRIVATE_KEY:'"0834ef4704e89ea9b0c65e4ca24776dd"',
  BASE_API:'"/api"'
})
