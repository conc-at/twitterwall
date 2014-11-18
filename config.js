'use strict'
/*jshint camelcase: false */
module.exports = {
  title: '.concat() 2015 Twitterwall',
  hashtag: '#concat15',
  logo: '/logos/concat_logo.svg',
  port: process.env.PORT || 8000,
  twitter: {
    throttle: 100,
    tracks: ['#javascript', '#concat', '#concat15', '#concat2015'],
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
    blocked: [],
    blockRetweets: false,
    blockPossiblySensitive: false
  },
  sponsors: [{
    name: 'University of Applied Sciences',
    image: '/images/fhs.jpg',
    duration: 1000
  },{
    name: '.concat() 2015',
    image: '/images/concat.svg',
    duration: 3000
  }]
}
