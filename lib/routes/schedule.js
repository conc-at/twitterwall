'use strict'

var debug = require('debug')('twitterwall')
var Lanyrd = require('lanyrd')

var libLanyrd = require('../lanyrd')

module.exports = function(app) {
  app.get('/schedule', function(req, res){
    debug('sending schedule...')
    Lanyrd.schedule(app.configjs.lanyrd.id, app.configjs.lanyrd.year, function(err, resp, schedule){
      if(err) return res.send({error: err})
      res.send(libLanyrd.prettify(schedule))
    })
  })
}
