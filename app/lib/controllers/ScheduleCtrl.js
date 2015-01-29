'use strict'

var randomColor = require('randomcolor')

module.exports = function(app) {
  app.controller('ScheduleCtrl', function($scope, $http, $interval, config) {
    var today = config.lanyrd.overwriteDate || (new Date()).toISOString().substr(0, 10)
    var forerun = 10 // in minutes
    var roomColors = config.lanyrd.roomColors
    var todayData

    function getNextTalks(){
      var nextTalks = {}
      var now = new Date()
      var compare = new Date(today)
      compare.setHours(now.getHours())
      compare.setMinutes(now.getMinutes())
      Object.keys(todayData).forEach(function(room) {
        todayData[room].some(function(v){
          var time = new Date(v.start_time)
          if (((time - compare) / 1000 * 60 * 60) > forerun) {
            nextTalks[room] = v
            nextTalks[room].style = {
              spacename: {color: roomColors[room]}
            }
            return true
          }
        })
      })
      return nextTalks
    }

    function talksToArray(nextTalks){
      var ret = []
      Object.keys(nextTalks).forEach(function(v){
        ret.push(nextTalks[v])
      })
      return ret
    }

    $http.get('/schedule').then(function(res) {
      var dataSet = {}
      Object.keys(res.data).forEach(function(room) {
        Object.keys(res.data[room]).forEach(function(date){
          if(date === today) {
            dataSet[room] = res.data[room][date]
            if(!roomColors[room]) roomColors[room] = randomColor()
          }
        })
      })
      todayData = dataSet
    })

    var currentIndex = 0
    $interval(function() {
      var nextTalks = talksToArray(getNextTalks())
      if(nextTalks[currentIndex]){
        $scope.nextUp = nextTalks[currentIndex]
        currentIndex++
      }
      else{
        if(nextTalks[0]) $scope.nextUp = nextTalks[0]
        currentIndex = 1
      }
    }, config.lanyrd.showNext)
  })
}
