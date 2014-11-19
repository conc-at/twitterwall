'use strict'

var markdown = require('markdown').markdown
var twemoji = require('twemoji')

module.exports = function(app) {
  app.directive('flashMessage', function($animate, $timeout, socket) {
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

        function cancel() {
          if (timeout) $timeout.cancel(timeout)
        }

        function svgify(icon) {
          return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'
        }

        var timeout = null;
        socket.on('flash', function(flash){
          if (!flash.message) {
            hide()
            return cancel()
          }
          if (flash.markdown) {
            console.log('detected markdown')
            flash.message = markdown.toHTML(flash.message)
          }
          scope.message = twemoji.parse(flash.message, svgify)
          scope.$apply()
          show()
          cancel()
          if(flash.duration === 0) return
          timeout = $timeout(hide, flash.duration)
        })

      }
    }
  })
}
