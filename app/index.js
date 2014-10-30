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
  .controller('SiteCtrl', function($scope, $sanitize, $http, $interval) {
    $scope.config = require('../config')

    $scope.tweets = []

    $scope.lanyrd = []

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
          $scope.background = src
        })
        .attr('src', src)
    }, 5000)

    $http.get('/schedule').then(function(res) {
      var dataSet
      var today = (new Date()).toISOString().slice(0,10)

      Object.keys(res.data).forEach(function(date) {
        if (date === today) {
          dataSet = res.data[date]
        }
      })

      if (!dataSet) {
        dataSet = res.data[Object.keys(res.data)[0]]
      }

      $scope.lanyrd = dataSet
    })

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

app.constant('moment', moment)
ngTimeRelative(app)
