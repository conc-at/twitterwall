'use strict'

module.exports = function(app) {
  [
    './sponsoring',
    './tweet'
  ].forEach(route) {
    require(route)(app)
  }
}
