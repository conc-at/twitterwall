'use strict'

module.exports = function (app) {
  app.controller('SponsorCtrl', function ($scope, $timeout) {
    var sponsors = $scope.config.sponsors

    function swap () {
      sponsors.unshift(sponsors.pop())
      $scope.sponsor = sponsors[0]
      $timeout(swap, $scope.sponsor.duration || 1e4)
    }

    swap()
  })
}
