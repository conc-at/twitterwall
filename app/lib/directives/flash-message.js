'use strict'

var twemoji = require('twemoji')

module.exports = function(app) {
  app.directive('flashMessage', function($animate, socket) {
    return {
      scope: {},
      template: '<span ng-bind-html="message"></span>',
      link: function(scope, element) {

        function show() {
          $animate.addClass(element, 'flash-message')
        }

        function hide() {
          $animate.removeClass(element, 'flash-message')
        }

        function svgify(icon) {
          return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'
        }

        var timeout = null;
        socket.on('flash', function(flash){
          if (!flash.message) {
            hide()
            if (timeout) timeout.cancel()
            return
          }
          scope.message = twemoji.parse(flash.message, svgify)
          scope.$apply()
          show()
          if(timeout) timeout.cancel()
          if(flash.duration === 0) return
          timeout = $timeout(hide, flash.duration)
        })

      }
    }
  })
}
