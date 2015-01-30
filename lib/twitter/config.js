'use strict'

module.exports.parse = function(tracks, users, userids) {
  var ousers = users.map(function(v){
    if(v && v.charAt(0) === '@') return v
    return '@' + v
  })
  var qusers = ousers.map(function(v){
    return 'from:' + v
  })
  var qstr = qusers.join(' OR ') + ' OR ' + tracks.join(' OR ') + ' OR ' + ousers.join(' OR ')
  return {hashtags: {track: tracks.join(',')}, qstr: qstr, users: {follow: userids.join(','), track: ousers.join(',')}}
}
