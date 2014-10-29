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
var TS = new TweetStream({
  /*jshint camelcase: false */
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.ACCESS_TOKEN,
  token_secret: process.env.ACCESS_TOKEN_SECRET
  /*jshint camelcase: true */
})

debug('starting streams...')

TS.on('tweet', function (tweet) {
  console.log('tweet received', tweet)
})

TS.on('reconnect', function(rce){
  console.log(rce.type)
})

TS.on('error', function (err) {
  console.log('Oh no')
})

TS.track('banana')
TS.track('mango')

//var userStream = T.stream('statuses/filter', {follow: '2704051574', track: '@conc_at'})
//var hashStream = T.stream('statuses/filter', {track: 'mango,#concat,#concat15,#concat2015'})

;[/*hashStream, userStream*/].forEach(function(stream) {
  stream.on('tweet', function(tweet) {
    debug('tweet: %s', tweet.text)
    io.emit('tweet', tweet)
  })
  stream.on('error', function(err) {
    debug('error: %s', err.message)
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

app.get('/faketweet', function(req, res){
  io.emit('tweet', {text: '#concat'})
  res.send('fake')
})

var port = process.env.PORT || 8000

server.listen(port, function() {
  debug('Listening on %d', port)
})
