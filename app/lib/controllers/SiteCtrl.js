'use strict'

var twemoji = require('twemoji')

module.exports = function(app) {
  app.controller('SiteCtrl', function($scope, $timeout, socket, config) {
    $scope.config = config

    var $flash = angular.element(document.querySelector('#flash'))
    var timeout = null;
    socket.on('flash', function(flash){
      if(!flash.message) {
        $flash.removeClass('active')
        if(timeout) timeout.cancel()
        return
      }
      $scope.message = twemoji.parse(flash.message, function(icon) {return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'})
      $scope.$apply()
      $flash.addClass('active')
      if(timeout) timeout.cancel()
      if(flash.duration === 0) return
      timeout = $timeout(function() {
        $flash.removeClass('active')
      }, flash.duration)
    })
  })
}
