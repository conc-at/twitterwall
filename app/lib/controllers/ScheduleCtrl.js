'use strict'

module.exports = function(app) {
  app.controller('ScheduleCtrl', function($scope, $http, $interval) {
    var todayData

    $http.get('/schedule').then(function(res) {
      var dataSet
      var today = (new Date()).toISOString().slice(0,10)

      Object.keys(res.data).forEach(function(date) {
        if (date === today) {
          dataSet = res.data[date]
        }
      })

      if (!dataSet) {
        dataSet = res.data[Object.keys(res.data)[0]]
      }

      todayData = dataSet
      $scope.nextUp = dataSet[0]
    })

    // in minutes
    var forerun = 10

    $interval(function() {
      // TODO: handle new room format
      return
      var now = new Date()
      var compare = new Date(todayData[0].date)
      compare.setMinutes(now.getMinutes())
      compare.setHours(now.getHours())

      for (var session in todayData) {
        session = todayData[session]
        var time = new Date(session.start_time)

        if (((time - compare) / 1000 * 60 * 60) > forerun) {
          $scope.nextUp = session
          break
        }
      }
    }, 5000)
  })
}
