'use strict'

/*jshint camelcase: false */
var parallizer = require('parallizer')

module.exports = function(app, lib){
  app.debug('resolving screen names')
  app.configjs.twitter.users = app.configjs.twitter.users.map(function(v){
    if(v && v.charAt(0) === '@') return v.substr(1)
    return v
  })
  app.twitter.get('users/lookup', {screen_name: app.configjs.twitter.users.join(',')}, function (err, data, response) {
    if(err) return app.debug('error: %s', err)
    var userids = []
    data.forEach(function(u){
      userids.push(u.id_str)
    })
    var searchConf = lib.twitter.config.parse(app.configjs.twitter.tracks, app.configjs.twitter.users, userids)
    app.debug('starting streams...')
    var hashStream = app.twitter.stream('statuses/filter', searchConf.hashtags)
    var userStream = app.twitter.stream('statuses/filter', searchConf.users)
    var stream = lib.twitter.unify([hashStream, userStream])

    var parseSendTweet = function(socket, queue, tweet){
      app.debug('tweet: %s', tweet.text)
      if(lib.twitter.block(tweet, app.configjs.admin.blocked)) return app.debug('tweet blocked')
      var sendTweet = function(){
        app.debug('adding tweet to queue (%d)', queue._queue.length)
        queue.sadd(lib.utils.throttleDelay(app.configjs.twitter.throttle), tweet, socket.emit.bind(socket, 'tweet'))
      }

      if(tweet.entities.urls.length > 0){
        app.debug('resolving urls (%d)', tweet.entities.urls.length)
        var urlResolver = parallizer.Parallel(1, sendTweet)
        tweet.entities.urls.forEach(lib.twitter.resolver.bind(null, urlResolver))
      }
      else sendTweet()
    }

    var tweetBuffer = parallizer.Parallel(1)
    stream.on('tweet', parseSendTweet.bind(null, app.socketio, tweetBuffer))

    stream.on('error', function (err) {
      app.debug('error: %s', err.message)
    })

    app.socketio.on('connection', function(socket){
      if(!app.configjs.twitter.tweetHistory) return
      app.debug('getting tweets with: %s', searchConf.qstr)
      app.twitter.get('search/tweets', {
        q: searchConf.qstr,
        count: 10
      }, function(err, data, response) {
        if(err) return app.debug('error: %s', err)
        var tweetBuffer = parallizer.Parallel(1)
        data.statuses.reverse().forEach(parseSendTweet.bind(null, socket, tweetBuffer))
      })
    })
  })
}
