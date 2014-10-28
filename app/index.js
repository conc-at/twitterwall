var angular = require('angular')

angular.module('twitterwall', [])
  .controller('SiteCtrl', function($scope, $http) {
    $scope.tweets = []

    $http.get('tweets').then(function(res) {
      $scope.tweets = res.data.statuses
    })
  })
