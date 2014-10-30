var angular = require('angular')
var ngTimeRelative = require('ng-time-relative')
var moment = require('ng-time-relative/node_modules/moment')
require('angular-sanitize')
require('angular-animate')

var link = require('twitter-text')
var emoji = require('emojize')

function avatar(url) {
  return url.replace('_normal','_bigger')
}

var app = angular.module('twitterwall', ['ngSanitize', 'ngAnimate'])
  .controller('SiteCtrl', function($scope, $sanitize) {
    $scope.tweets = []

    $scope.linkTweet = function(tweet) {
      return emoji.emojize(link.autoLink(tweet.text, tweet.entities.urls))
    }

    $scope.linkMedia = function(media) {
      return decodeURI(media.media_url_https)
    }

    $scope.socket.on('tweet', function(tweet){
      if (tweet.retweeted_status || tweet.possibly_sensitive) {
        return
      }

      tweet.user.profile_image_url = avatar(tweet.user.profile_image_url)
      tweet.user.profile_image_url_https = avatar(tweet.user.profile_image_url_https)

      $scope.tweets.unshift(tweet)

      if ($scope.tweets.length > 6) {
        $scope.tweets = $scope.tweets.slice(0, 6)
      }

      $scope.$apply()
    })

    $scope.socket.on('block', function(block){
      console.log(block)
    })
  })
  .run(function($rootScope) {
    $rootScope.socket = io()
  })
  .constant('config', require('../config'))

app.constant('moment', moment)
ngTimeRelative(app)
