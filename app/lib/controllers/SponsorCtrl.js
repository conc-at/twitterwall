'use strict'

module.exports = function(app) {
  app.controller('SponsorCtrl', function($scope, $interval) {
    var sponsors = $scope.config.sponsoring.sponsors
    $interval(function() {
      console.log(sponsors[0])
      sponsors.unshift(sponsors.pop())
    }, $scope.config.sponsoring.displayDuration)
  })
}
