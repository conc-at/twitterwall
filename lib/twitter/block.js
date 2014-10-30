'use strict'

module.exports = function(tweet, blocklist){
  return blocklist.some(function(block){
    if((tweet.text.toLowerCase().indexOf(block.toLowerCase()) > -1) || (block.charAt(0) === '@' && tweet.user.screen_name.toLowerCase() === block.substr(1).toLowerCase())){
      return true
    }
  })
}
