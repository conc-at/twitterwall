'use strict'

/*jshint camelcase: false */
var config = {
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET
}

config.token = config.access_token
config.token_secret = config.access_token_secret

module.exports = function() {
  return config
}
