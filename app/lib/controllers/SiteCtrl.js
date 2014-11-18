'use strict'

var twemoji = require('twemoji')

module.exports = function(app) {
  app.controller('SiteCtrl', function($scope, $timeout, socket, config) {
    $scope.config = config

    var $flash = angular.element(document.querySelector('#flash'))

    socket.on('flash', function(flash){
      if(!flash.message) return $flash.removeClass('active')
      $scope.message = twemoji.parse(flash.message, {size: 72})
      $scope.$apply()
      $flash.addClass('active')
      if(flash.duration === 0) return
      $timeout(function() {
        $flash.removeClass('active')
      }, flash.duration)
    })
  })
}
