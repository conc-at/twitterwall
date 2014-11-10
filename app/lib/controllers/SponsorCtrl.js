'use strict'

module.exports = function(app) {
  app.controller('SponsorCtrl', function($scope, config) {
    $scope.config = config
  })
}
