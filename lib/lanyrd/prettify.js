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
    var id = s.space_name || '_'
    retObj[id] = retObj[id] || {}
    retObj[id][s.date] = retObj[id][s.date] || []
    retObj[id][s.date].push(s)
  })
  return retObj
}
