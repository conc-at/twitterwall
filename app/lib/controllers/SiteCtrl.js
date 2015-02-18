'use strict'

module.exports = function (app) {
  app.controller('SiteCtrl', function ($scope, $timeout, socket, config) {
    $scope.config = config

    /*socket.on('highlight', function(tweet){
      console.log(tweet.text)
    })*/
  })
}
