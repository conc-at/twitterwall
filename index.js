'use strict'

var http = require('http')

var express = require('express')
var Twit = require('twit')

var lib = require('./lib')

var app = express()
var server = http.Server(app)

app.debug = require('debug')('twitterwall')
app.configjs = require('./config')
app.socketio = require('socket.io')(server)
app.twitter = new Twit(app.configjs.twitter.auth)
app.configjs.admin.blocked = app.configjs.admin.blocked || []

lib.middlewares(app)
lib.routes(app)

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
    tweetBuffer.sadd(lib.utils.throttleDelay(app.configjs.twitter.throttle), tweet, app.socketio.emit.bind(io, 'tweet'))
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

var testTweets = require('./data/tweets.json')
app.socketio.of('/test').on('connection', function(socket){
  lib.twitter.stagger(socket, testTweets.statuses)
})

var port = process.env.PORT || 8000

server.listen(port, function() {
  app.debug('Listening on %d', port)
})
