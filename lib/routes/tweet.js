'use strict'

var basicAuth = require('basic-auth-connect')

module.exports = function(app, lib) {
  if(!app.configjs.admin.enableAPI) return;
  app.post('/tweet', basicAuth(app.configjs.admin.username, app.configjs.admin.password), function(req, res) {
    app.debug('sending fake tweet...')
    if(!req.body.user || !req.body.text) {
      app.debug('error: wrong parameters')
      return res.send({error: 'wrong parameters'})
    }
    app.twitter.get('users/show', {screen_name: req.body.user}, function (err, data, response) {
      if(err){
        app.debug('error: %s', err)
        return res.send({error: err})
      }
      /*jshint camelcase: false */
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
      app.socketio.emit('tweet', tweet)
      res.send({success: true})
    })
  })
}
