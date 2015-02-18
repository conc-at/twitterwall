'use strict'

module.exports = function (app) {
  app.directive('tweet', function () {
    return {
      restrict: 'E',
      templateUrl: 'tweet.html',
      link: function () {}
    }
  })
}
