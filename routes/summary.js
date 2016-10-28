var express = require('express');
var router = express.Router();
var request = require('request');

var https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();
var deferred = require('fk-common-utils').deferred;
var authClient = require('./../lib/authn-login-client').getAuthnClient();
var authnConfig = require('./../lib/authn-config');
var customAccJParser = require('./accruals/customAccrualJsonParser');
var urls = require('./URL');
var rawJson = null;

router.get('/api',function (req,res,next) {

  var url = "http://10.85.51.31/accrual/revenue_accrual?external_ref_id="+req.query.id;
  console.log("url is:"+url);
  var tokenHash = authClient.login(request,authnConfig.clientId);
  tokenHash.pipe(function (result) {
    var args = {
      headers: {
        "X_BU_ID": "FKMP",
        "Authorization": "Bearer " + result['token'],
        "content-type": "application/json"
      }
    };
    client.get(url, args, function (data, response) {
      console.log("in summary");
      //console.log(JSON.stringify(data));
      rawJson = JSON.stringify(data);
      console.log(customAccJParser.customAccJParser(rawJson));

      res.send(data);
      // res.render('error',{title: 'error'});
    });
    return deferred.success(result);
  });


});


module.exports = router;
