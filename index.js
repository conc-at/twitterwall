'use strict'

var http = require('http')
var path = require('path')

var debug = require('debug')('twitterwall')
var express = require('express')
var Twit = require('twit')
var TweetStream = require('node-tweet-stream')
var parallizer = require('parallizer')

var lib = require('./lib')

var app = express()
var server = http.Server(app)
var io = require('socket.io')(server)
var T = new Twit(lib.twitterconfig)

var htTS = new TweetStream(lib.twitterconfig)
var uTS = new TweetStream(lib.twitterconfig)

debug('starting streams...')

;[htTS, uTS].forEach(function(stream) {
  stream.on('tweet', function (tweet) {
    debug('tweet: %s', tweet.text)
    io.emit('tweet', tweet)
  })
  stream.on('reconnect', function(rce) {
    debug('reconnect: %s', rce.type)
  })
  stream.on('error', function (err) {
    debug('error: %s', err)
  })
})

htTS.track('banana')
htTS.track('#concat')
htTS.track('#concat15')
htTS.track('#concat2015')

debug('resolving screen name')

T.get('users/lookup', {screen_name: 'conc_at,hackernewsbot,zurvollenstunde'}, function (err, data, response) {
  if(err) return
  data.forEach(function(u){
    debug('found twitter id(@%s): %s', u.screen_name, u.id_str)
    uTS.follow(u.id_str)
    uTS.track('@' + u.screen_name)
  })
})

io.on('connection', function(socket){
  T.get('search/tweets', {
    q: 'from:@conc_at OR @conc_at OR #concat OR #concat15 OR #concat2015',
    count: 10
  }, function(err, data, response) {
    if(err) return
    var prl = parallizer.Parallel(1)
    data.statuses.forEach(function(t){
      prl.sadd(function(t, cb){
        setTimeout(function(){
          socket.emit('tweet', t)
          cb()
        }, 500 + Math.random()*2000)
      }, t);
    })

  })
})


var testTweets = require('./data/tweets.json')

io.of('/test').on('connection', function(socket){
  var prl = parallizer.Parallel(1)
  testTweets.statuses.forEach(function(t){
    prl.sadd(function(t, cb){
      setTimeout(function(){
        socket.emit('tweet', t)
        cb()
      }, 500 + Math.random()*2000)
    }, t);
  })
})

app.use(express.static(path.join(__dirname, 'build')))

var port = process.env.PORT || 8000

server.listen(port, function() {
  debug('Listening on %d', port)
})
