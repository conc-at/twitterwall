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
lib.socketio(app, lib)

var port = process.env.PORT || 8000

server.listen(port, function() {
  app.debug('Listening on %d', port)
})
