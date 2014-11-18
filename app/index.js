var angular = require('angular')
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
      'https://v.cdn.vine.co/**',
      'https://mtc.cdn.vine.co/**',
      'https://pbs.twimg.com/**'
    ]);
  })

angular.injector(['ng']).invoke(function($http) {
  $http.get('/config').then(function(res) {
    console.log(res.data)
    app.constant('config', res.data)
    angular.bootstrap(document, ['twitterwall'])
  })
})

ngTimeRelative(app)
lib.controllers(app)
