'use strict'

module.exports = function(app) {
  require('./ScheduleCtrl')(app)
  require('./TweetCtrl')(app)
}
