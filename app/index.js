var angular = require('angular')

angular.module('twitterwall', [])
  .controller('SiteCtrl', function($scope) {
    $scope.tweets = []

    $scope.socket.on('tweet', function(tweet){
      $scope.tweets.unshift(tweet)
      $scope.$apply()
    })
  })
  .run(function($rootScope) {
    $rootScope.socket = io('/test')
  })
