'use strict'

module.exports = function(app, lib) {
  [
    './tweets'
  ].forEach(function(route) {
    require(route)(app, lib)
  })
}
