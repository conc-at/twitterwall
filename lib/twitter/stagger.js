'use strict'

var parallizer = require('parallizer').Parallel(1)

var exports = module.exports = function(socket, tweets) {
  tweets.forEach(function(tweet) {
    parallizer.sadd(
      exports.randomDelay,
      tweet,
      socket.emit.bind(socket, 'tweet')
    )
  })
}

exports.randomDelay = function(tweet, callback) {
  setTimeout(
    callback.bind(null, tweet),
    500 + Math.random() * 2e3
  )
}
