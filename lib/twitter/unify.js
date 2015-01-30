'use strict'

var EventEmitter = require('events').EventEmitter
var events = ['tweet', 'error']

var exports = module.exports = function(streams) {
  var emitter = new EventEmitter()

  streams.forEach(exports.pipe.bind(null, emitter))

  return emitter
}

exports.pipe = function(emitter, stream) {
  events.forEach(function(event) {
    stream.on(event, emitter.emit.bind(emitter, event))
  })
}
