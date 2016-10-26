var express = require('express');
var router = express.Router();
var request = require('request');
var httpObj = require('http');
var urls = require('./URL');
var https = require('https');
var Client = require('node-rest-client').Client;
var authClient = require('./../lib/authn_login_client').getAuthnClient();
var authnToken = "";
var client = new Client();
var deferred = require('fk-common-utils').deferred;
var config = require('config');

router.get('/api',function (req,res,next) {
  // direct way
  var url = "http://10.85.50.152:80/v1/invoice/type/payable_credit_note?invoice_ref_2="+req.query.id;
  console.log(url);
  console.log("before authn");
  var tokenHash = authClient.login(request,"AccountingTracker");
  console.log("token hash from main js " +tokenHash);
  tokenHash.pipe(function (result) {
    // updateHeader(result['token']);
    console.log("result is" + result['token']);
    var args = {
      headers: {
        "X_BU_ID": "FKMP",
        "Authorization": "Bearer " + result['token'],
        "content-type": "application/json"
      }
    };
    console.log("the url is: "+url);
    console.log(args);
    
    client.get(url, args, function (data, response) {

      // parsed response body as js object
      console.log("result" + JSON.stringify(data));
      console.log("raw response "+response);
      res.send(JSON.stringify(data));
      // res.render('error',{title: 'error'});
    });
    return deferred.success(result);
  });
  



});


module.exports = router;
