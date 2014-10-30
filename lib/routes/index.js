'use strict'

module.exports = function(app) {
  [
    './schedule',
    './sponsoring',
    './tweet'
  ].forEach(route) {
    require(route)(app)
  }
}
