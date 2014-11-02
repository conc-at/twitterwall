'use strict'

/*jshint camelcase: false */

var angular = require('angular')
var link = require('twitter-text')
var emoji = require('emojize')

var exports = module.exports = function(app) {
  app.controller('TweetCtrl', function($scope, $rootScope, $interval, socket) {
    $scope.tweets = []

    $scope.linkTweet = function(tweet) {
      return emoji.emojize(link.autoLink(tweet.text, tweet.entities.urls))
    }

    $scope.linkMedia = function(media) {
      return decodeURI(media.media_url_https)
    }

    socket.on('tweet', function(tweet){
      if (tweet.retweeted_status || tweet.possibly_sensitive) {
        console.log('blocked!')
        return
      }

      tweet.user.profile_image_url = exports.avatar(tweet.user.profile_image_url)
      tweet.user.profile_image_url_https = exports.avatar(tweet.user.profile_image_url_https)

      $scope.tweets.unshift(tweet)

      if ($scope.tweets.length > 6) {
        $scope.tweets = $scope.tweets.slice(0, 6)
      }

      $scope.$apply()
    })

    socket.on('block', function(block){
      console.log(block)
    })

    var $preloader = angular.element(document.querySelector('.preloader'))

    $interval(function() {
      if (!$scope.tweets) {
        return
      }
      var src = $scope.tweets[0].user.profile_banner_url
      if (!src) {
        return
      }
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
