'use strict'

var basicAuth = require('basic-auth-connect')
var debug = require('debug')('twitterwall')

var config = require('../../config')

module.exports = function(app) {
  app.post('/block', basicAuth(config.admin.username, config.admin.password), function(req, res){
    if(req.body.block && app.blockedTweets.indexOf(req.body.block) < 0){
      debug('blocking user/tweet: %s', req.body.block)
      app.blockedTweets.push(req.body.block)
    }
    var ubIdx = app.blockedTweets.indexOf(req.body.unblock)
    if(req.body.unblock &&  ubIdx > -1){
      debug('blocking user/tweet: %s', req.body.unblock)
      app.blockedTweets.splice(ubIdx, 1);
    }
    res.send(app.blockedTweets)
  })
}
