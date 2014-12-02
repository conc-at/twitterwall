'use strict'

var angular = require('angular')
var markdown = require('markdown').markdown
var twemoji = require('twemoji')

module.exports = function(app) {
  app.directive('flashMessage', function($animate, $interval, socket) {
    return {
      scope: {},
      template: '<span ng-bind-html="message"></span><span class="timer">10</span>',
      link: function(scope, element) {
        var doHide = false
        var doneTs = 0
        var timeLeft = 0
        var timerEl = angular.element(document.querySelector('.timer'))

        function show() {
          $animate.addClass(element, 'flash-message')
        }

        function hide() {
          $animate.removeClass(element, 'flash-message')
        }

        function showTimer(){
          timerEl.addClass('show')
        }

        function hideTimer(){
          timerEl.removeClass('show')
        }

        function updateTimer(){
          timerEl.text(timeLeft)
        }

        function tick(){
          if(!doHide) return
          var cTs = (new Date()).getTime()
          if(cTs >= doneTs){
            hide()
            doHide = false
          }
          else{
            var tl = Math.round((doneTs - cTs)/1000)
            if(timeLeft !== tl){
              timeLeft = tl
              updateTimer()
            }
          }
        }

        function svgify(icon) {
          return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'
        }

        $interval(tick, 100)

        socket.on('flash', function(flash){
          doHide = false
          timeLeft = 0
          hideTimer()
          if (!flash.message) return hide()
          if (flash.markdown) {
            console.log('detected markdown')
            flash.message = markdown.toHTML(flash.message)
          }
          scope.message = twemoji.parse(flash.message, svgify)
          if(flash.duration){
            timeLeft = Math.round(flash.duration/1000)
            doneTs = (new Date()).getTime() + flash.duration
            doHide = true
            showTimer()
            updateTimer()
          }
          scope.$apply()
          show()
        })
      }
    }
  })
}
