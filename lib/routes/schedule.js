'use strict'

var debug = require('debug')('twitterwall')
var Lanyrd = require('lanyrd')

var config = require('../../config')

module.exports = function(app) {
  app.get('/schedule', function(req, res){
    debug('sending schedule...')
    Lanyrd.schedule(config.lanyrd.id, config.lanyrd.year, function(err, resp, schedule){
      if(err) return res.send({error: err})
      res.send(schedule)
    })
  })
}
