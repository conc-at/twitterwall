'use strict'

module.exports = function(app) {
  app.controller('ScheduleCtrl', function($scope, $http) {
    $scope.lanyrd = []

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

      $scope.lanyrd = dataSet
    })
  })
}
