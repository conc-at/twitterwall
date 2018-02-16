'use strict';

/*jshint camelcase: false */

var e = process.env;

module.exports = {
  title: e.TITLE || '.concat() 2018 Twitterwall',
  hashtag: e.HASHTAG || '#concat18',
  port: e.PORT || 8000,
  //overwriteTime: '2018-03-03T08:00:00+01:00', // for debugging
  twitter: {
    throttle: 1000,
    tracks: (e.HASHTAGS || '#concat,#concat18,#concat2018').split(','),
    users: (e.USERS || 'conc_at').split(','),
    tweetHistory: true,
    auth: {
      access_token: e.ACCESS_TOKEN,
      access_token_secret: e.ACCESS_TOKEN_SECRET,
      consumer_key: e.CONSUMER_KEY,
      consumer_secret: e.CONSUMER_SECRET
    }
  },
  tschuad: {
    overwriteDate: '2018-03-03', // for debugging
    id: e.TSCHUAD_ID || 1,
    showNext: 15000,
    roomColors: {
      Audimax: '#E40138',
      HS110: '#1DA4C1',
      Foyer: '#FDB906'
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
  sponsors: [
    {
      image: 'https://2018.conc.at/images/logos/namics@2x.jpg',
      name: 'Namics',
      duration: 20000
    },
    {
      image: 'https://2018.conc.at/images/logos/pixelart@2x.jpg',
      name: 'Pixelart',
      duration: 20000
    },
    {
      image: 'https://2018.conc.at/images/logos/fh@2x.jpg',
      name: 'FH Salzburg',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/poi@2x.jpg',
      name: 'Porsche Informatik',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/google@2x.jpg',
      name: 'Google',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/aws@2x.jpg',
      name: 'AWS',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/mozilla@2x.jpg',
      name: 'Mozilla',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/automattic@2x.jpg',
      name: 'Automattic',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/beenergised@2x.jpg',
      name: 'be.energised',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/stickeryou@2x.jpg',
      name: 'Sticker You',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/dna@2x.jpg',
      name: 'Die Netzarchitekten',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/jetbrains@2x.jpg',
      name: 'Jetbrains',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/kat@2x.jpg',
      name: 'karriere.at',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/elements@2x.jpg',
      name: 'elements',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/findologic@2x.jpg',
      name: 'Findologic',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/manner@2x.jpg',
      name: 'Manner',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/makava@2x.jpg',
      name: 'Makava',
      duration: 10000
    },
    {
      image: 'https://2018.conc.at/images/logos/gesagt.getan@2x.jpg',
      name: 'gesagt.getan',
      duration: 10000
    }
  ]
};
