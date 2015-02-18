'use strict'

/*jshint camelcase: false */

var e = process.env

module.exports = {
  title: e.TITLE || '.concat() 2015 Twitterwall',
  hashtag: e.HASHTAG || '#concat15',
  port: e.PORT || 8000,
  twitter: {
    throttle: 1000,
    tracks: (e.HASHTAGS || '#concat,#concat15,#concat2015').split(','),
    users: (e.USERS || 'conc_at').split(','),
    tweetHistory: true,
    auth: {
      access_token: e.ACCESS_TOKEN,
      access_token_secret: e.ACCESS_TOKEN_SECRET,
      consumer_key: e.CONSUMER_KEY,
      consumer_secret: e.CONSUMER_SECRET
    }
  },
  lanyrd: {
    overwriteDate: '2015-03-07', // for debugging
    year: e.LANYRD_YEAR || '2015',
    id: e.LANYRD_ID || 'concat',
    showNext: 15000,
    roomColors: {
      'Audimax': '#c30813',
      'Room 110': '#169c19',
      'Lounge': '#c35a18'
    }
  },
  admin: {
    enableAPI: e.ADMIN_USER && e.ADMIN_PASSWORD,
    username: e.ADMIN_USER,
    password: e.ADMIN_PASSWORD,
    blocked: e.BLOCKED_USERS ? e.BLOCKED_USERS.split(',') : [],
    blockRetweets: true,
    blockPossiblySensitive: true
  },
  sponsors: [{
    image: 'https://conc.at/images/logos/zalando@2x.png',
    name: 'Zalando Technology',
    duration: 20000
  }, {
    image: 'https://conc.at/images/logos/pusher@2x.png',
    name: 'Pusher',
    duration: 20000
  }, {
    image: 'https://conc.at/images/logos/braintree@2x.png',
    name: 'Braintree Payments',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/aws@2x.png',
    name: 'Amazon Web Services',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/travis@2x.png',
    name: 'Travis CI',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/hoodie@2x.png',
    name: 'Hoodie',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/mandrill@2x.png',
    name: 'Mandrill',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/gg@2x.png',
    name: 'gesagt.getan',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/siili@2x.png',
    name: 'Siili',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/diamonddogs@2x.png',
    name: 'the diamond:dogs|group',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/codeschool@2x.png',
    name: 'codeschool',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/techtrrrs@2x.png',
    name: 'techtrrrs',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/cws@2x.jpg',
    name: 'Coworking Salzburg',
    duration: 10000
  }, {
    image: 'https://conc.at/images/logos/fh@2x.jpg',
    name: 'University of Applied Sciences Salzburg',
    duration: 10000
  }]
}
