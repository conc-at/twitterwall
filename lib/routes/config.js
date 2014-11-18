'use strict'

var omit = require('lodash.omit')

module.exports = function(app, lib) {
  app.get('/config', function(req, res){
    app.debug('sending config...')
    var config = omit(app.configjs, 'admin')
    config.twitter = omit(config.twitter, 'auth')
    res.send(config)
  })
}
