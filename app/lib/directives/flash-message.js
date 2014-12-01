'use strict'

var markdown = require('markdown').markdown
var twemoji = require('twemoji')

module.exports = function(app) {
  app.directive('flashMessage', function($animate, $interval, socket) {
    return {
      scope: {},
      template: '<span ng-bind-html="message"></span>',
      link: function(scope, element) {
        var doHide = false
        var doneTs = 0
        var currentDisplayTs = '0'

        function show() {
          $animate.addClass(element, 'flash-message')
        }

        function hide() {
          $animate.removeClass(element, 'flash-message')
        }

        function tick(){
          if(!doHide) return
          var cTs = (new Date()).getTime()
          if(cTs >= doneTs){
            hide()
            doHide = false
          }
          else{
            var sl = ((doneTs - cTs)/1000).toFixed(0)
            if(currentDisplayTs !== sl) {
              currentDisplayTs = sl
              console.log(currentDisplayTs)
            }
          }
        }

        function svgify(icon) {
          return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'
        }

        $interval(tick, 100)

        socket.on('flash', function(flash){
          doHide = false
          if (!flash.message) return hide()
          if (flash.markdown) {
            console.log('detected markdown')
            flash.message = markdown.toHTML(flash.message)
          }
          scope.message = twemoji.parse(flash.message, svgify)
          scope.$apply()
          show()
          if(!flash.duration) return
          doneTs = (new Date()).getTime() + flash.duration
          doHide = true
        })

      }
    }
  })
}
