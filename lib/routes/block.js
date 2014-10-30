'use strict'

var basicAuth = require('basic-auth-connect')
var debug = require('debug')('twitterwall')

var config = require('../../config')

module.exports = function(app) {
  app.post('/block', basicAuth(config.admin.username, config.admin.password), function(req, res){
    debug('blocking user/tweet...')
    //req.body
    res.send('OK')
  })
}
