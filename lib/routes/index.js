'use strict'

module.exports = function(app) {
  [
    './tweet'
  ].forEach(route) {
    require(route)(app)
  }
}
