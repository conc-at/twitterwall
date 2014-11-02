'use strict'
/*jshint camelcase: false */
module.exports = {
  title: '.concat() 2015 Twitterwall',
  hashtag: '#concat15',
  port: process.env.PORT || 8000,
  twitter: {
    throttle: 1000,
    tracks: ['#yolo', '#javascript', '#concat', '#concat15', '#concat2015'],
    users: ['conc_at', 'hackernewsbot', 'zurvollenstunde'],
    auth: {
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET
    }
  },
  lanyrd: {
    year: '2014',
    id: 'barcamp-salzburg-october',
    showNext: 5*60*1000
  },
  admin: {
    enableAPI: true,
    username: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASSWORD,
    blocked: []
  },
  sponsoring: {
    sponsors: {
      'Fachhochschule Salzburg GmbH': {
        image: 'https://barcamp-sbg.at/images/logos/fh@2x.jpg'
      }
    },
    displayDuration: 5000
  }
}
