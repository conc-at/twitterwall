'use strict'

module.exports = function(app, lib) {
  [
    './tweets',
    './test'
  ].forEach(function(route) {
    require(route)(app, lib)
  })
}
