'use strict'

module.exports = function(app) {
  app.controller('SiteCtrl', function($scope, $timeout, socket, config) {
    $scope.config = config
  })
}
