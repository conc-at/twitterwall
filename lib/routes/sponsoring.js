'use strict'

var debug = require('debug')('twitterwall')

module.exports = function(app) {
  app.get('/sponsoring', function(req, res){
    debug('sending sponsoring...')
    res.send(app.configjs.sponsoring)
  })
}
