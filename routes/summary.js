var express = require('express');
var router = express.Router();
var request = require('request');
var httpObj = require('http');
var urls = require('./URL');
var https = require('https');
var Client = require('node-rest-client').Client;
var authClient = require('./../authn_login_client').getAuthnClient();

var client = new Client();



var url = "http://www.mocky.io/v2/5185415ba171ea3a00704eed";


router.get('/api',function (req,res,next) {
  // direct way
  var url = urls.shippingAPI+req.query.id;
  console.log(url);
  console.log("before authn");
  var token = authClient.login(request,"AccountingTracker");
  console.log("after authn: "+token);
  client.get(url, function (data, response) {
    // parsed response body as js object
    console.log(JSON.stringify(data,null,2));
    // raw response
    //console.log(response);
    res.send(JSON.stringify(data));
    // res.render('error',{title: 'error'});
  });



});


module.exports = router;
