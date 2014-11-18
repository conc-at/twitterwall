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

    var $preloader = angular.element(document.querySelector('.preloader'))

    $interval(function() {
      if (!$scope.tweets) {
        return
      }
      if(!$scope.tweets || !$scope.tweets[0] || !$scope.tweets[0].user || !$scope.tweets[0].user.profile_banner_url) return
      var src = $scope.tweets[0].user.profile_banner_url
      src += '/web_retina'
      $preloader
        .on('load', function() {
          $preloader.off('load')
          $rootScope.background = src
        })
        .attr('src', src)
    }, 5000)
  })
}

exports.avatar = function(url) {
  return url.replace('_normal','_bigger')
}
