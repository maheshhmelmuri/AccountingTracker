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
var Set = require("collections/set");
var clientHelper = require('./../lib/client-helper');
var BU;
var buList = new Set();
/* GET home page. */
router.get('/', function(req, res, next) {
  var random= 'my main application';
  // fetchBusinessUnit(function(returnValue) {
  //   getlist(fetchBusinessUnit);
  //   function getlist(fetchBusinessUnit) {
   var buData = fetchBusinessUnit();
        // res.render('home', { title: 'Accounting Tracker', buList: buList});
    // }
    buData.pipe(function (callbacks) {
        res.render('home', { title: 'Accounting Tracker', buList: buList});
    });

});

function fetchBusinessUnit() {
    var url = urlConfig.buListAPI;
    console.log(url);
    var header = {};
    var result = clientHelper.getHelper().execute('get',header,'businessUnit','FKMP');
    return result.pipe(function(data) {
        for(var i=0;i<data.length;i++){
            buList.add(data[i]["name"]);
            console.log(data[i]);
        }
        console.log("result in main fetchBusiness"+JSON.stringify(data));
        return deferred.success(result);
    });
}

module.exports = router;
