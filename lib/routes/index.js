'use strict'

module.exports = function(app, lib) {
  [
    './block',
    './schedule',
    './sponsoring',
    './tweet',
    './config'
  ].forEach(function(route) {
    require(route)(app, lib)
  })
}
