'use strict'

var moment = require('moment')

function compareStartDate(a, b){
  var aStart = moment(a.start_time)
  var bStart = moment(b.start_time)
  if(aStart.isBefore(bStart)) return -1
  if(aStart.isAfter(bStart)) return 1
  return 0
}

module.exports = function(schedule){
  var retObj = {}
  schedule.forEach(function(s){
    retObj[s.date] = retObj[s.date] || []
    retObj[s.date].push(s)
  })
  Object.keys(retObj).forEach(function(d){
    retObj[d].sort(compareStartDate)
  })
  return retObj
}