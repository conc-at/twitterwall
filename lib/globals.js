'use strict'

var Twit = require('twit')

module.exports = function (app, server) {
  app.debug = require('debug')('twitterwall')
  app.configjs = require('../config')
  app.socketio = require('socket.io')(server)
  app.twitter = new Twit(app.configjs.twitter.auth)
  app.configjs.admin.blocked = app.configjs.admin.blocked || []
}
