'use strict'

module.exports = function(app) {
  app.controller('SiteCtrl', function($scope, socket, config) {
    $scope.config = config

    socket.on('flash', function(message){
      console.log(message)
    })
  })
}
