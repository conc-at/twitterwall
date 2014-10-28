'use strict'

var path = require('path')

var express = require('express')

var app = express()

app.use(express.static(path.join(__dirname, 'static')))

app.get('/tweets', function(req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT || 8000)
