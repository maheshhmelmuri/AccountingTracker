var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();


var urlConfig = require('./url');
var https = require('https');
var authClient = require('./../lib/authn-login-client').getAuthnClient();
var authnToken = "";
var deferred = require('fk-common-utils').deferred;
var config = require('config');
var request = require('request');
var httpObj = require('http');
var buList=[];
/* GET home page. */
router.get('/', function(req, res, next) {
  var random= 'my main application';
  // fecthBusinessUnit('',function(returnValue) {
      fetchBusinessUnit();
      console.log("started rendering");
      res.render('home', { title: 'Accounting Tracker', buList: buList});

  // });
});

function fetchBusinessUnit() {
    var url = urlConfig.buListAPI;
    console.log(url);
    var tokenHash = authClient.login(request,"AccountingTracker");
    tokenHash.pipe(function (result) {
        var args = {
            headers: {
                "Authorization": "Bearer " + result['token'],
                "content-type": "application/json",
                "X_BU_ID": "FKMP"
            }
        };
        client.get(url, args, function (data, response) {
            console.log("result" + JSON.stringify(data));
            for(var i=0;i<data.length;i++){
                // console.log(data[i]["name"]);
                buList.push(data[i]["name"]);
            }
        });
        console.log("value returned");
        return deferred.success(result);
    });
}

module.exports = router;
