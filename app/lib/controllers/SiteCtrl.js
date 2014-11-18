'use strict'

module.exports = function(app) {
  app.controller('SiteCtrl', function($scope, $timeout, socket, config) {
    $scope.config = config

    var $flash = angular.element(document.querySelector('#flash'))

    socket.on('flash', function(message){
      $scope.message = message
      $scope.$apply()
      $flash.addClass('active')
      $timeout(function() {
        $flash.removeClass('active')
      }, 1e4)
    })
  })
}
