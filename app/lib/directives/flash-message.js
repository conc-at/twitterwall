'use strict'

/* global document */

var markdown = require('markdown').markdown
var twemoji = require('twemoji')

module.exports = function (app) {
  app.directive('flashMessage', function ($animate, $timeout, socket) {
    return {
      scope: {},
      templateUrl: 'flash.html',
      link: function (scope, element) {
        function show () {
          return $animate.addClass(element, 'flash-message')
        }

        function clear () {
          return $animate.removeClass(element, 'flash-message')

          .then(function () {
            scope.flash = null
          })
        }

        function svgify (icon) {
          return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'
        }

        var timeout
        socket.on('flash', function (flash) {
          clear()

          .then(function () {
            if (timeout) $timeout.cancel(timeout)
            if (!flash.message) return
            if (flash.markdown) flash.message = markdown.toHTML(flash.message)
            flash.message = twemoji.parse(flash.message, svgify)

            scope.flash = flash

            show()

            .then(function () {
              if (!flash.duration) return

              timeout = $timeout(clear, flash.duration)
            })
          })
        })
      }
    }
  })
}
