'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if (!app.configjs.admin.enableAPI) return
  app.post('/block', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res) {
    if (req.body.clear) {
      app.debug('clearing blocking list')
      app.configjs.admin.blocked.length = 0
    } else if (typeof req.body.block === 'string') {
      var blockkw = req.body.block.toLowerCase()
      if (app.configjs.admin.blocked.indexOf(blockkw) < 0) {
        app.debug('blocking user/tweet: %s', blockkw)
        app.configjs.admin.blocked.push(blockkw)
        app.socketio.emit('block', blockkw)
      }
    } else if (typeof req.body.unblock === 'string') {
      var unblockkw = req.body.unblock.toLowerCase()
      var ubIdx = app.configjs.admin.blocked.indexOf(unblockkw)
      if (ubIdx > -1) {
        app.debug('unblocking user/tweet: %s', unblockkw)
        app.configjs.admin.blocked.splice(ubIdx, 1)
      }
    }
    res.send(app.configjs.admin.blocked)
  })
}
