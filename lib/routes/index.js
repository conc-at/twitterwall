'use strict'

module.exports = function(app, lib) {
  [
    './block',
    './schedule',
    './config',
    './tweet',
    './flash'
  ].forEach(function(route) {
    require(route)(app, lib)
  })
}
