'use strict'

/*jshint camelcase: false */
var request = require('request')
var urljoin = require('url-join')

var exports = module.exports = function(queue, url){
  if(/^http:\/\/twitter.com\/.*\/photo\/\d/.test(url.expanded_url)) queue.sadd(exports.resolveGif, url)
  else if(/^http:\/\/instagram.com\/p\//.test(url.expanded_url)) queue.sadd(exports.resolveInsta, url)
  else if(/^https:\/\/vine.co\/v\//.test(url.expanded_url)) queue.sadd(exports.resolveVine, url)
  else queue.sadd(exports.noop)
}


exports.resolveGif = function(url, callback){
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

exports.resolveInsta = function(url, callback){
  //TODO instagram videos
  url.expanded_url_img = urljoin(url.expanded_url.replace('?modal=true', ''), 'media?size=l')
  callback(null)
}

exports.resolveVine = function(url, callback){
  request(urljoin(url.expanded_url, '/embed/simple?related=0'), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var foundUrl = /videoUrl: "(.*?)"/.exec(body)
      if(foundUrl.length > 1){
        url.expanded_url_mp4 = foundUrl[1]
        callback(null)
      }
      else callback('not found')
    }
    else callback(error || 'error')
  })
}

exports.noop = function(callback){
  callback(null)
}
