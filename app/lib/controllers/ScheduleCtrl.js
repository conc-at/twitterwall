'use strict'

module.exports = function(app) {
  app.controller('ScheduleCtrl', function($scope, $http, $interval) {
    var today = '2014-10-24' || (new Date()).toISOString().substr(0, 10)
    var forerun = 10 // in minutes
    var todayData

    function getCurrentTalks(){
      var currentTalks = {}
      var now = new Date()
      var compare = new Date(today)
      compare.setMinutes(now.getMinutes())
      compare.setHours(now.getHours())
      Object.keys(todayData).forEach(function(room) {
        todayData[room].some(function(v){
          var time = new Date(v.start_time)
          if (((time - compare) / 1000 * 60 * 60) > forerun) {
            currentTalks[room] = v
            return true
          }
        })
      })
      return currentTalks
    }
    $http.get('/schedule').then(function(res) {
      var dataSet = {}

      Object.keys(res.data).forEach(function(room) {
        Object.keys(res.data[room]).forEach(function(date){
          if(date === today) dataSet[room] = res.data[room][date]
        })
      })

      todayData = dataSet
      $scope.nextUp = getCurrentTalks()
      console.log($scope.nextUp)
    })


    $interval(function() {
      // TODO
    }, 5000)
  })
}
