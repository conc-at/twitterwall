'use strict'

module.exports = function(app) {
  app.controller('SiteCtrl', function($scope, config) {
    $scope.config = config
  })
}
