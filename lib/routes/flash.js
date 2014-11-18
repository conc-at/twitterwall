'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return;
  app.post('/flash', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res){
    var duration = req.body.duration || 0
    app.debug('flashed message: %s (%d)', req.body.message || '<null>', duration)
    app.socketio.emit('flash', {message: req.body.message, duration: duration})
    res.send({success: true})
  })
}
