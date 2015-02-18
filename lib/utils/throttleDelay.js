'use strict'

module.exports = function (delay) {
  return function (tweet, callback) {
    setTimeout(callback.bind(null, tweet), delay)
  }
}
