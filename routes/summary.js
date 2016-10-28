var express = require('express');
var router = express.Router();
var request = require('request');

var https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();
var deferred = require('fk-common-utils').deferred;

var config = require('config');
var clientHelper = require('./../lib/client-helper');
var header = {};
var BuName;
var searchType;

router.get('/api',function (req,res,next) {
  // direct way
  BuName = req.query.BU;
  searchType = req.query.type;
  var searchId = req.query.id;
  var paramHash = {};
  paramHash[searchType] = searchId;
  var result = clientHelper.getHelper().execute('get',header,'invoice',BuName, paramHash);
  return result.pipe(function(token) {
    console.log("api first result sent below "+ JSON.stringify(result));
    res.send(token);
  });
});


module.exports = router;
