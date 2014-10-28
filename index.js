'use strict'

var path = require('path')

var express = require('express')
var Twit = require('twit')

var T = new Twit({
  /*jshint camelcase: false */
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
  /*jshint camelcase: true */
})

var app = express()

app.use(express.static(path.join(__dirname, 'static')))

app.get('/tweets', function(req, res) {
  res.send('hello world')
})

var port = process.env.PORT || 8000
app.listen(port, function() {
  console.log("Listening on " + port)
})
