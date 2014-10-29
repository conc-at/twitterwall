'use strict'

var http = require('http')
var path = require('path')

var debug = require('debug')('twitterwall')
var express = require('express')
var Twit = require('twit')
var TweetStream = require('node-tweet-stream')
var socketio = require('socket.io')
var parallizer = require('parallizer')

var app = express()
var server = http.Server(app)
var io = socketio(server)
var T = new Twit({
  /*jshint camelcase: false */
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
  /*jshint camelcase: true */
})

var configTS = {
  /*jshint camelcase: false */
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.ACCESS_TOKEN,
  token_secret: process.env.ACCESS_TOKEN_SECRET
  /*jshint camelcase: true */
}

var htTS = new TweetStream(configTS)
var uTS = new TweetStream(configTS)

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

uTS.follow('2704051574')
uTS.track('@conc_at')

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
