'use strict'

module.exports = function(app, lib) {
  [
    './block',
    './schedule',
    './config',
    './tweet',
    './flash',
    './highlight'
  ].forEach(function(route) {
    require(route)(app, lib)
  })
}
