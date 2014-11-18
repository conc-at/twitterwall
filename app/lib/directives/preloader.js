'use strict'

module.exports = function(app) {
  app.directive('preloader', function($rootScope, $interval) {
    function link(scope, element) {
      console.log('such linked')
      $interval(function() {
        console.log('swagger')
        console.log(scope)
        console.log(scope.tweets)

        if (!scope.tweets) {
          return
        }
        if(!scope.tweets || !scope.tweets[0] || !scope.tweets[0].user || !scope.tweets[0].user.profile_banner_url) return
        var src = scope.tweets[0].user.profile_banner_url
        src += '/web_retina'
        element
          .on('load', function() {
            element.off('load')
            $rootScope.background = src
          })
          .attr('src', src)
      }, 5000)
    }

    return {
      restrict: 'C',
      link: link
    }
  })
}
