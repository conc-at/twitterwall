'use strict'

var debug = require('debug')('twitterwall')

var config = require('../../config')

module.exports = function(app) {
  app.get('/sponsoring', function(req, res){
    debug('sending sponsoring...')
    res.send(config.sponsoring)
  })
}
