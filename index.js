'use strict'

var lib = require('./lib')

var app = require('express')()
var server = require('http').Server(app)

lib.globals(app, server)
lib.middlewares(app)
lib.routes(app, lib)
lib.socketio(app, lib)

server.listen(app.configjs.port, function() {
  app.debug('Listening on %d', app.configjs.port)
})
