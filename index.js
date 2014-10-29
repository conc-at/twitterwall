'use strict'

var http = require('http')
var path = require('path')

var debug = require('debug')('twitterwall')
var express = require('express')
var Twit = require('twit')

var lib = require('./lib')
var config = require('./config.js')

var app = express()
var server = http.Server(app)
var io = require('socket.io')(server)
var T = new Twit(config.twitter.auth)

var hashStream = T.stream('statuses/filter', {track: '💩,banana,#concat,#concat15,#concat2015'})
var userStream = T.stream('statuses/filter', {follow: '2704051574', track: '@conc_at'})

debug('starting streams...')

var stream = lib.twitter.unify([hashStream, userStream])

stream.on('tweet', function (tweet) {
  debug('tweet: %s', tweet.text)
  io.emit('tweet', tweet)
})

stream.on('error', function (err) {
  debug('error: %s', err.message)
})

debug('resolving screen name')

T.get('users/lookup', {screen_name: 'conc_at,hackernewsbot,zurvollenstunde'}, function (err, data, response) {
  if(err) return
  data.forEach(function(u){
    debug('found twitter id(@%s): %s', u.screen_name, u.id_str)
    //u.id_str
    //'@' + u.screen_name
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
