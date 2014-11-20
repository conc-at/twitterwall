'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return
  app.post('/highlight', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res){
    if(!req.body.id) return res.send({error: 'wrong parameters'})
    app.debug('highlighted tweet: %s', req.body.id)
    app.twitter.get('statuses/show/:id', {id: req.body.id}, function(err, data, response) {
      if(err) {
        app.debug('error: %s', err)
        return res.send({error: err})
      }
      app.socketio.emit('highlight', data)
      res.send({success: true})
    })
  })
}
