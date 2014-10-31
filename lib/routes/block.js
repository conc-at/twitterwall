'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return;
  app.post('/block', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res){
    if(req.body.block && app.configjs.admin.blocked.indexOf(req.body.block) < 0){
      app.debug('blocking user/tweet: %s', req.body.block)
      app.configjs.admin.blocked.push(req.body.block)
      app.socketio.emit('block', req.body.block)
    }
    var ubIdx = app.configjs.admin.blocked.indexOf(req.body.unblock)
    if(req.body.unblock &&  ubIdx > -1){
      app.debug('blocking user/tweet: %s', req.body.unblock)
      app.configjs.admin.blocked.splice(ubIdx, 1);
    }
    res.send(app.configjs.admin.blocked)
  })
}
