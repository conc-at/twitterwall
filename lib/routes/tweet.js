'use strict'

var basicAuth = require('basic-auth-connect')
var debug = require('debug')('twitterwall')

module.exports = function(app) {
  app.post('/tweet', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res) {
    debug('sending fake tweet...')
    //req.body
    res.send('OK')
  })
}
