'use strict'

/*jshint camelcase: false */

var angular = require('angular')
var link = require('twitter-text')
var twemoji = require('twemoji')

var exports = module.exports = function (app) {
  app.controller('TweetCtrl', function ($scope, $rootScope, $interval, socket, config) {
    $scope.tweets = []
    var self = this

    self.normalize = exports.normalize.bind(null, config.admin)

    socket.on('tweet', function (tweet) {
      tweet = self.normalize(tweet)

      if (!tweet) return

      $scope.tweets.unshift(tweet)

      if ($scope.tweets.length > 10) {
        $scope.tweets = $scope.tweets.slice(0, 10)
      }

      $scope.$apply()
    })

    socket.on('block', function (block) {
      angular.forEach($scope.tweets, function (tweet, idx) {
        if (!exports.block(tweet, block)) return
        $scope.tweets.splice(idx, 1)
        $scope.$apply()
      })
    })
  })
}

exports.avatar = function (url) {
  return url.replace('_normal', '_bigger')
}

exports.block = function (tweet, block) {
  if (new RegExp(block, 'i').test(tweet.text)) {
    console.log('removed tweet containing', block)
    return true
  }

  if (block[0] === '@' && new RegExp(block.substr(1), 'i').test(tweet.user.screen_name)) {
    console.log('removed tweet from', block)
    return true
  }

  return false
}

exports.emojify = function (text, entities) {
  return twemoji.parse(link.autoLink(text, {
    urlEntities: entities.urls
  }), function (icon) {
    return 'https://twemoji.maxcdn.com/svg/' + icon + '.svg'
  })
}

exports.normalize = function (blocks, tweet) {
  if (blocks.blockRetweets && tweet.retweeted_status)
    return console.log('blocked retweet!')

  if (blocks.blockPossiblySensitive && tweet.possibly_sensitive)
    return console.log('blocked possibly sensitive!')

  tweet.user.profile_image_url = exports.avatar(tweet.user.profile_image_url)
  tweet.user.profile_image_url_https = exports.avatar(tweet.user.profile_image_url_https)

  if (tweet.entities.media) {
    tweet.entities.media.map(function (medium) {
      medium.media_url_https = decodeURI(medium.media_url_https)
      return medium
    })
  }

  tweet.text = exports.emojify(tweet.text, tweet.entities)

  return tweet
}
