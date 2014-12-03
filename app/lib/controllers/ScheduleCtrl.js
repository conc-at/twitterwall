'use strict'

module.exports = function(app) {
  app.controller('ScheduleCtrl', function($scope, $http, $interval) {
    var todayData

    function getCurrentTalks(){
      // TODO
      var currentTalks = {}
      Object.keys(todayData).forEach(function(room) {
        currentTalks[room] = todayData[room].shift()
      })
      return currentTalks
    }
    $http.get('/schedule').then(function(res) {
      var dataSet = {}
      var today = '2014-10-24' || (new Date()).toISOString().substr(0, 10)

      Object.keys(res.data).forEach(function(room) {
        Object.keys(res.data[room]).forEach(function(date){
          if(date === today) dataSet[room] = res.data[room][date]
        })
      })

      todayData = dataSet
      $scope.nextUp = getCurrentTalks()
      console.log($scope.nextUp)
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
