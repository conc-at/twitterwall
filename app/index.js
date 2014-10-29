var angular = require('angular')
require('angular-sanitize')
var link = require('twitter-text')
var emoji = require('emojize')

angular.module('twitterwall', ['ngSanitize'])
  .controller('SiteCtrl', function($scope, $sanitize) {
    $scope.tweets = []

    $scope.linkTweet = function(tweet) {
      return emoji.emojize(link.autoLink(tweet.text, tweet.entities.urls))
    }

    $scope.socket.on('tweet', function(tweet){
      if (tweet.retweeted_status || tweet.possibly_sensitive) {
        return
      }

      $scope.tweets.unshift(tweet)

      if ($scope.tweets.length > 10) {
        $scope.tweets = $scope.tweets.slice(0, 10)
      }

      $scope.$apply()
    })
  })
  .run(function($rootScope) {
    $rootScope.socket = io()
  })
