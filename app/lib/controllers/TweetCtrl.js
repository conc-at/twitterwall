'use strict'

/*jshint camelcase: false */

var angular = require('angular')
var link = require('twitter-text')
var twemoji = require('twemoji')

var exports = module.exports = function(app) {
  app.controller('TweetCtrl', function($scope, $rootScope, $interval, socket, config) {
    $scope.tweets = []

    $scope.linkTweet = function(tweet) {
      return twemoji.parse(link.autoLink(tweet.text, {urlEntities: tweet.entities.urls}), function(icon) {return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'})
    }

    $scope.linkMedia = function(media) {
      return decodeURI(media.media_url_https)
    }

    socket.on('tweet', function(tweet){
      if(config.admin.blockRetweets && tweet.retweeted_status) return console.log('blocked retweet!')
      if(config.admin.blockPossiblySensitive && tweet.possibly_sensitive) return console.log('blocked possibly sensitive!')

      tweet.user.profile_image_url = exports.avatar(tweet.user.profile_image_url)
      tweet.user.profile_image_url_https = exports.avatar(tweet.user.profile_image_url_https)

      $scope.tweets.unshift(tweet)

      if ($scope.tweets.length > 6) {
        $scope.tweets = $scope.tweets.slice(0, 6)
      }

      $scope.$apply()
    })

    socket.on('block', function(block){
      angular.forEach($scope.tweets, function(tweet, idx) {
        if (!RegExp(block, 'i').test(tweet.text)) {
          return
        }
        console.log('removed tweet containing', block)
        $scope.tweets.splice(idx, 1)
        $scope.$apply()
      })
    })
  })
}

exports.avatar = function(url) {
  return url.replace('_normal','_bigger')
}
