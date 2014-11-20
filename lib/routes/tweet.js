'use strict'

var basicAuth = require('basic-auth-connect')
var parallizer = require('parallizer')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return
  var tweetBuffer = parallizer.Parallel(1)
  var psTweet = lib.twitter.parseSendTweet('faketweet', app, lib).bind(null, app.socketio, tweetBuffer)
  app.post('/tweet', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res) {
    if(!req.body.user || typeof req.body.user !== 'string' || !req.body.text || typeof req.body.text !== 'string') {
      app.debug('error: wrong parameters')
      return res.send({error: 'wrong parameters'})
    }
    if(req.body.user.charAt(0) === '@') req.body.user = req.body.user.substr(1)
    app.debug('sending fake tweet (%s): %s', req.body.user, req.body.text)
    app.twitter.get('users/show', {screen_name: req.body.user}, function (err, data, response) {
      if(err){
        app.debug('error: %s', err)
        return res.send({error: err})
      }
      /*jshint camelcase: false */
      //TODO entity detection
      var tweetId = Math.floor(Math.random()*1000000)
      var tweet = {
        created_at: new Date(),
        id: tweetId,
        id_str: tweetId.toString(),
        text: req.body.text,
        user: data,
        entities:{
          hashtags: [],
          symbols: [],
          urls: [],
          user_mentions: []
        },
        retweeted_status: false,
        possibly_sensitive: false
      }
      psTweet(tweet)
      res.send({success: true})
    })
  })
}
