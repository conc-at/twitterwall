'use strict'

module.exports = function(app) {
  require('./flash-message')(app)
  require('./preloader')(app)
  require('./tweet')(app)
}
