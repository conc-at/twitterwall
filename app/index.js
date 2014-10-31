var angular = require('angular')
var ngTimeRelative = require('ng-time-relative')
var moment = require('ng-time-relative/node_modules/moment')
require('angular-sanitize')
require('angular-animate')

var lib = require('./lib')

var app = angular.module('twitterwall', ['ngSanitize', 'ngAnimate'])
  .controller('SiteCtrl', function($scope, config) {
    $scope.config = config
  })
  .constant('config', require('../config'))
  .constant('socket', io())
  .constant('moment', moment)

ngTimeRelative(app)
lib.controllers(app)
