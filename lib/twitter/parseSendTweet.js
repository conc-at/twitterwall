'use strict'

var parallizer = require('parallizer')

module.exports = function (name, app, lib) {
  return function (socket, queue, tweet) {
      app.debug('[%s] tweet: %s', name, tweet.text)
      if (lib.twitter.block(tweet, app.configjs.admin.blocked)) return app.debug('[%s] tweet blocked!', name)
      var sendTweet = function () {
        app.debug('[%s] adding tweet to queue (%d)', name, queue._queue.length)
        queue.sadd(lib.utils.throttleDelay(app.configjs.twitter.throttle), tweet, socket.emit.bind(socket, 'tweet'))
      }
      if (tweet.entities.urls.length > 0) {
        app.debug('[%s] resolving urls (%d)', name, tweet.entities.urls.length)
        var urlResolver = new parallizer.Parallel(1, sendTweet)
        tweet.entities.urls.forEach(lib.twitter.resolver.bind(null, urlResolver))
      } else sendTweet()
    }
}
