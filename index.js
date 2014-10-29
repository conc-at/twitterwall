'use strict'

var http = require('http')
var path = require('path')

var debug = require('debug')('twitterwall')
var express = require('express')
var Twit = require('twit')
var TweetStream = require('node-tweet-stream')

var lib = require('./lib')

var app = express()
var server = http.Server(app)
var io = require('socket.io')(server)
var T = new Twit(lib.twitter.config)

var hashStream = new TweetStream(lib.twitter.config)
var userStream = new TweetStream(lib.twitter.config)

debug('starting streams...')

var stream = lib.twitter.unify([hashStream, userStream])

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

hashStream.track('banana')
hashStream.track('#concat')
hashStream.track('#concat15')
hashStream.track('#concat2015')

debug('resolving screen name')

T.get('users/lookup', {screen_name: 'conc_at,hackernewsbot,zurvollenstunde'}, function (err, data, response) {
  if(err) return
  data.forEach(function(u){
    debug('found twitter id(@%s): %s', u.screen_name, u.id_str)
    userStream.follow(u.id_str)
    userStream.track('@' + u.screen_name)
  })
})

io.on('connection', function(socket){
  T.get('search/tweets', {
    q: 'from:@conc_at OR @conc_at OR #concat OR #concat15 OR #concat2015',
    count: 10
  }, function(err, data, response) {
    if(err) return
    lib.twitter.stagger(socket, data.statuses)
  })
})



var testTweets = require('./data/tweets.json')
io.of('/test').on('connection', function(socket){
  lib.twitter.stagger(socket, testTweets.statuses)
})

app.use(express.static(path.join(__dirname, 'build')))

var port = process.env.PORT || 8000

server.listen(port, function() {
  debug('Listening on %d', port)
})
