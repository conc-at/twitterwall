'use strict'

module.exports = function(app) {
  [
    './block',
    './schedule',
    './sponsoring',
    './tweet'
  ].forEach(route) {
    require(route)(app)
  }
}
