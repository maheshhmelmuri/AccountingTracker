var express = require('express');
var router = express.Router();
var request = require('request');
var httpObj = require('http');
var urls = require('./url');
var https = require('https');
var Client = require('node-rest-client').Client;
var authClient = require('./../lib/authn-login-client').getAuthnClient();
var authnToken = "";
var client = new Client();
var deferred = require('fk-common-utils').deferred;
var config = require('config');
var clientHelper = require('./../lib/client-helper');
var header = {};

router.get('/api',function (req,res,next) {
  // direct way
  var result = clientHelper.getHelper().execute('get',header,'invoice','FKMP');
  return result.pipe(function(token) {
    console.log("api first result sent below "+ JSON.stringify(result));
    res.send(token);
  });
});


module.exports = router;
