var angular = require('angular')
var ngTimeRelative = require('ng-time-relative')
var moment = require('ng-time-relative/node_modules/moment')
require('angular-sanitize')
require('angular-animate')

var lib = require('./lib')

var app = angular.module('twitterwall', ['ngSanitize', 'ngAnimate'])
  .controller('SiteCtrl', function($scope, $http) {
    $scope.config = require('../config')

    $scope.lanyrd = []

    $http.get('/schedule').then(function(res) {
      var dataSet
      var today = (new Date()).toISOString().slice(0,10)

      Object.keys(res.data).forEach(function(date) {
        if (date === today) {
          dataSet = res.data[date]
        }
      })

      if (!dataSet) {
        dataSet = res.data[Object.keys(res.data)[0]]
      }

      $scope.lanyrd = dataSet
    })
  })
  .constant('socket', io())
  .constant('moment', moment)

ngTimeRelative(app)
lib.controllers(app)
