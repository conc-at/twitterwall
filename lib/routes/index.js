'use strict'

module.exports = function(app) {
  [
    './block',
    './schedule',
    './sponsoring',
    './tweet'
  ].forEach(function(route) {
    require(route)(app)
  })
}
