'use strict'

var Lanyrd = require('lanyrd')

module.exports = function(app, lib) {
  app.get('/schedule', function(req, res) {
    app.debug('sending schedule...')
    Lanyrd.schedule(app.configjs.lanyrd.id, app.configjs.lanyrd.year, function(err, resp, schedule) {
      if (err) return res.send({error: err})
      res.send(lib.lanyrd.prettify(schedule))
    })
  })
}
