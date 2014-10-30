'use strict'

module.exports = function(app, lib) {
  app.get('/sponsoring', function(req, res){
    app.debug('sending sponsoring...')
    res.send(app.configjs.sponsoring)
  })
}
