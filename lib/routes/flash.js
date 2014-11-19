'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return;
  app.post('/flash', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res){
    if(typeof req.body.message !== 'string') return res.send({error: 'message must to be a string'})
    var duration = parseInt(req.body.duration, 10)
    if(isNaN(duration)) duration = 0
    app.debug('flashed message: %s (%d/%s)', req.body.message || '<null>', duration, !!req.body.markdown)
    app.socketio.emit('flash', {message: req.body.message, duration: duration, markdown: !!req.body.markdown})
    res.send({success: true})
  })
}
