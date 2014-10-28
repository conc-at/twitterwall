'use strict'

var http = require('http')
var path = require('path')

var debug = require('debug')('twitterwall')
var express = require('express')
var Twit = require('twit')
var socketio = require('socket.io')

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

debug('starting streams...')
var hashStream = T.stream('statuses/filter', {track: '#concat,#concat15,#concat2015'})
var userStream = T.stream('statuses/filter', {follow: '2704051574', track: '@conc_at'})

userStream.on('tweet', function(tweet) {
  debug('user: %s', tweet.text)
  io.emit('tweet', tweet)
})

hashStream.on('tweet', function(tweet) {
  debug('hash: %s', tweet.text)
  io.emit('tweet', tweet)
})

app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'build')))

app.get('/tweets', function(req, res) {
  T.get('search/tweets', {
    q: 'from:@conc_at OR @conc_at OR #concat OR #concat15 OR #concat2015',
    count: 10
  }, function(err, data, response) {
    if (err) {
      return res.sendStatus(500)
    }
    res.send(data)
  })
})

var port = process.env.PORT || 8000

server.listen(port, function() {
  debug('Listening on %d', port)
})
