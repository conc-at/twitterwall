'use strict'

var basicAuth = require('basic-auth-connect')
var debug = require('debug')('twitterwall')

var config = require('../../config')

module.exports = function(app) {
  app.post('/tweet', basicAuth(config.admin.username, config.admin.password), function(req, res) {
    debug('sending fake tweet...')
    //req.body
    res.send('OK')
  })
}
