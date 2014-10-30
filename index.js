'use strict'

var http = require('http')

var debug = require('debug')('twitterwall')
var express = require('express')
var basicAuth = require('basic-auth-connect')
var Twit = require('twit')
var Lanyrd = require('lanyrd')

var lib = require('./lib')
var config = require('./config')

var app = express()
var server = http.Server(app)
var io = require('socket.io')(server)
var T = new Twit(config.twitter.auth)

lib.middlewares(app)

function throttleDelay(tweet, callback) {
  setTimeout(
    callback.bind(null, tweet),
    config.twitter.throttle
  )
}

var blocked = config.admin.blocked || []

debug('resolving screen names')
T.get('users/lookup', {screen_name: config.twitter.users.join(',')}, function (err, data, response) {
  if(err) return debug('error: %s', err)
  var userids = []
  data.forEach(function(u){
    userids.push(u.id_str)
  })
  var searchConf = lib.twitter.config.parse(config.twitter.tracks, config.twitter.users, userids)
  debug('starting streams...')
  var hashStream = T.stream('statuses/filter', searchConf.hashtags)
  var userStream = T.stream('statuses/filter', searchConf.users)
  var stream = lib.twitter.unify([hashStream, userStream])
  var tweetBuffer = require('parallizer').Parallel(1)

  stream.on('tweet', function (tweet) {
    debug('tweet: %s', tweet.text)
    if(lib.twitter.block(tweet, blocked)) return debug('tweet blocked')
    tweetBuffer.sadd(throttleDelay, tweet, io.emit.bind(io, 'tweet'))
  })

  stream.on('error', function (err) {
    debug('error: %s', err.message)
  })

  io.on('connection', function(socket){
    T.get('search/tweets', {
      q: searchConf.qstr,
      count: 10
    }, function(err, data, response) {
      if(err) return
      lib.twitter.stagger(socket, data.statuses)
    })
  })
})

var testTweets = require('./data/tweets.json')
io.of('/test').on('connection', function(socket){
  lib.twitter.stagger(socket, testTweets.statuses)
})

app.post('/tweet', basicAuth(config.admin.username, config.admin.password), function(req, res){
  debug('sending fake tweet...')
  //req.body
  res.send('OK')
})

app.post('/block', basicAuth(config.admin.username, config.admin.password), function(req, res){
  debug('blocking user/tweet...')
  //req.body
  res.send('OK')
})

app.get('/sponsoring', function(req, res){
  debug('sending sponsoring...')
  res.send(config.sponsoring)
})


app.get('/schedule', function(req, res){
  debug('sending schedule...')
  Lanyrd.schedule(config.lanyrd.id, config.lanyrd.year, function(err, resp, schedule){
    if(err) return res.send({error: err})
    res.send(schedule)
  })
})

var port = process.env.PORT || 8000

server.listen(port, function() {
  debug('Listening on %d', port)
})
