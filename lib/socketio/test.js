'use strict'

var testTweets = require('../../data/tweets.json')

module.exports = function(app, lib) {
  app.socketio.of('/test').on('connection', function(socket){
    app.debug('sending fake tweets...')
    lib.twitter.stagger(socket, testTweets.statuses)
  })
}
