'use strict'

var request = require('request')

function resolveGif(url, callback){
  request(url.expanded_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var foundUrl = /video-src="(.*?)"/.exec(body)
      if(foundUrl.length > 1){
        url.expanded_url_mp4 = foundUrl[1]
        callback(null)
      }
      else callback('not found')
    }
    else callback(error || 'error')
  })
}

function resolveInsta(url, callback){
  //TODO instagram videos
  url.expanded_url_img = url.expanded_url + 'media?size=l'
  callback(null)
}

module.exports = function(app, lib){
  app.debug('resolving screen names')
  app.twitter.get('users/lookup', {screen_name: app.configjs.twitter.users.join(',')}, function (err, data, response) {
    if(err) return app.debug('error: %s', err)
    var userids = []
    data.forEach(function(u){
      userids.push(u.id_str)
    })
    var searchConf = lib.twitter.config.parse(app.configjs.twitter.tracks, app.configjs.twitter.users, userids)
    app.debug('starting streams...')
    var hashStream = app.twitter.stream('statuses/filter', searchConf.hashtags)
    var userStream = app.twitter.stream('statuses/filter', searchConf.users)
    var stream = lib.twitter.unify([hashStream, userStream])
    var tweetBuffer = require('parallizer').Parallel(1)

    stream.on('tweet', function (tweet) {
      app.debug('tweet: %s', tweet.text)
      if(lib.twitter.block(tweet, app.configjs.admin.blocked)) return app.debug('tweet blocked')
      var urlResolver = require('parallizer').Parallel(1, function(){
        tweetBuffer.sadd(lib.utils.throttleDelay(app.configjs.twitter.throttle), tweet, app.socketio.emit.bind(app.socketio, 'tweet'))
      })
      tweet.entities.urls.forEach(function(url){
        console.log(url)
        if(/^http:\/\/twitter.com\/.*\/photo\/\d/.test(url.expanded_url)) urlResolver.sadd(resolveGif, url)
        else if(/^http:\/\/instagram.com\/p\//.test(url.expanded_url)) urlResolver.sadd(resolveInsta, url)
      })
    })

    stream.on('error', function (err) {
      app.debug('error: %s', err.message)
    })

    app.socketio.on('connection', function(socket){
      app.debug('getting tweets with: %s', searchConf.qstr)
      app.twitter.get('search/tweets', {
        q: searchConf.qstr,
        count: 10
      }, function(err, data, response) {
        if(err) return app.debug('error: %s', err)
        lib.twitter.stagger(socket, data.statuses.reverse())
      })
    })
  })
}
