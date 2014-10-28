'use strict'

var path = require('path')

var express = require('express')

var app = express()

app.use(express.static(path.join(__dirname, 'static')))

app.get('/tweets', function(req, res) {
  res.send('hello world')
})

var port = process.env.PORT || 8000
app.listen(port, function() {
  console.log("Listening on " + port)
})
