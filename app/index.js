var angular = require('angular')
require('angular-sanitize')
var link = require('twitter-text')

angular.module('twitterwall', ['ngSanitize'])
  .controller('SiteCtrl', function($scope, $sanitize) {
    $scope.tweets = []

    $scope.linkTweet = function(tweet) {
      return link.autoLink(tweet.text, tweet.entities.urls)
    }

    $scope.socket.on('tweet', function(tweet){
      $scope.tweets.unshift(tweet)
      $scope.$apply()
    })
  })
  .run(function($rootScope) {
    $rootScope.socket = io('/test')
  })