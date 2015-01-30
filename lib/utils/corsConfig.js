'use strict'

module.exports = function(app) {
  var whitelist = app.configjs.admin.corsWhitelist || []
  return {
    origin: function(origin, callback) {
      callback(null, (whitelist.indexOf(origin) !== -1))
    }
  }
}
