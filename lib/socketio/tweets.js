'use strict'

/*jshint camelcase: false */
var parallizer = require('parallizer')

module.exports = function(app, lib) {
  app.debug('resolving screen names')
  app.configjs.twitter.users = app.configjs.twitter.users.map(function(v) {
    if (v && v.charAt(0) === '@') return v.substr(1)
    return v
  })
  app.twitter.get('users/lookup', {screen_name: app.configjs.twitter.users.join(',')}, function (err, data, response) {
    if (err) return app.debug('error: %s', err)
    var userids = []
    data.forEach(function(u) {
      userids.push(u.id_str)
    })
    var searchConf = lib.twitter.config.parse(app.configjs.twitter.tracks, app.configjs.twitter.users, userids)
    app.debug('starting streams...')
    var hashStream = app.twitter.stream('statuses/filter', searchConf.hashtags)
    var userStream = app.twitter.stream('statuses/filter', searchConf.users)
    var stream = lib.twitter.unify([hashStream, userStream])

    var tweetBuffer = parallizer.Parallel(1)
    var streamParseSendTweet = lib.twitter.parseSendTweet('streamtweet', app, lib)
    stream.on('tweet', streamParseSendTweet.bind(null, app.socketio, tweetBuffer))

    stream.on('error', function (err) {
      app.debug('error: %s', err.message)
    })

    var pastParseSendTweet = lib.twitter.parseSendTweet('pasttweet', app, lib)

    app.socketio.on('connection', function(socket) {
      if (!app.configjs.twitter.tweetHistory) return
      app.debug('getting tweets with for pasttweet (%s)', searchConf.qstr)
      app.twitter.get('search/tweets', {
        q: searchConf.qstr,
        count: 10
      }, function(err, data, response) {
        if (err) return app.debug('error: %s', err)
        var pTweetBuffer = parallizer.Parallel(1)
        data.statuses.reverse().forEach(pastParseSendTweet.bind(null, socket, pTweetBuffer))
      })
    })
  })
}
