'use strict'

module.exports = function(app, lib) {
  [
    './block',
    './schedule',
    './sponsoring',
    './tweet',
    './flash'
  ].forEach(function(route) {
    require(route)(app, lib)
  })
}
