var angular = require('angular')
var ngTimeRelative = require('ng-time-relative')
var moment = require('ng-time-relative/node_modules/moment')
require('angular-sanitize')
require('angular-animate')

var lib = require('./lib')

var app = angular.module('twitterwall', ['ngSanitize', 'ngAnimate'])
  .constant('config', require('../config'))
  .constant('socket', io())
  .constant('moment', moment)
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://pbs.twimg.com/**'
    ]);
  })

ngTimeRelative(app)
lib.controllers(app)
