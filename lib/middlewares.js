'use strict'

var path = require('path')

var bodyParser = require('body-parser')
var cors = require('cors')
var express = require('express')

module.exports = function(app, lib) {
  app.disable('x-powered-by')
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(express.static(path.join(__dirname, '../build')))
}
