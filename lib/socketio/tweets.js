'use strict'

module.exports = function(app, lib){
  app.debug('resolving screen names')
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
    var tweetBuffer = require('parallizer').Parallel(1)

    stream.on('tweet', function (tweet) {
      app.debug('tweet: %s', tweet.text)
      if(lib.twitter.block(tweet, app.configjs.admin.blocked)) return app.debug('tweet blocked')
      tweetBuffer.sadd(lib.utils.throttleDelay(app.configjs.twitter.throttle), tweet, app.socketio.emit.bind(app.socketio, 'tweet'))
    })

    stream.on('error', function (err) {
      app.debug('error: %s', err.message)
    })

    app.socketio.on('connection', function(socket){
      app.twitter.get('search/tweets', {
        q: searchConf.qstr,
        count: 10
      }, function(err, data, response) {
        if(err) return app.debug('error: %s', err)
        lib.twitter.stagger(socket, data.statuses.reverse())
      })
    })
  })
}
