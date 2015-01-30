var angular = require('angular')
var io = require('socket.io-client')
var ngTimeRelative = require('ng-time-relative')
var moment = require('ng-time-relative/node_modules/moment')
require('angular-sanitize')
require('angular-animate')

var lib = require('./lib')

var app = angular.module('twitterwall', ['ngSanitize', 'ngAnimate'])
  .constant('socket', io())
  .constant('moment', moment)
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://*.cdn.vine.co/**',
      'https://pbs.twimg.com/**',
      'https://*.akamaihd.net/**'
    ])
  })

angular.injector(['ng']).invoke(function($http) {
  $http.get('/config').then(function(res) {
    app.constant('config', res.data)
    angular.bootstrap(document, ['twitterwall'])
  })
})

ngTimeRelative(app)
lib.controllers(app)
lib.directives(app)
