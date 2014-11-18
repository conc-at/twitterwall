'use strict'

var path = require('path')

var bodyParser = require('body-parser')
var express = require('express')

module.exports = function(app) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(express.static(path.join(__dirname, '../build')))
}
