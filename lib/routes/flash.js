'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return;
  app.post('/flash', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res){
    app.debug('flashed message: %s', req.body.message || '<null>')
    app.socketio.emit('flash', req.body.message)
    res.send({success: true})
  })
}
