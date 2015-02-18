'use strict'

module.exports = function (schedule) {
  var retObj = {}
  schedule.forEach(function (s) {
    var id = s.space_name || '_'
    retObj[id] = retObj[id] || {}
    retObj[id][s.date] = retObj[id][s.date] || []
    retObj[id][s.date].push(s)
  })
  return retObj
}
