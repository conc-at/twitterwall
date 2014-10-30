'use strict'

var config = require('../../config.js')

module.exports = function (tweet, callback) {
  setTimeout(
    callback.bind(null, tweet),
    config.twitter.throttle
  )
}
