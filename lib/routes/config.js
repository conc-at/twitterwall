'use strict'

module.exports = function(app, lib) {
  app.get('/config', function(req, res){
    app.debug('sending config.js...')
    var cloneconfig = JSON.parse(JSON.stringify(app.configjs))
    delete cloneconfig.admin
    res.send(cloneconfig)
  })
}
