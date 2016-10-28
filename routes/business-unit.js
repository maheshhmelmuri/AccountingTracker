/**
 * Created by niyazulla.khan on 26/10/16.
 */

var express = require('express');
var router = express.Router();
var urlConfig = require('./url');
var https = require('https');
var Client = require('node-rest-client').Client;
var authClient = require('./../lib/authn-login-client').getAuthnClient();
var authnToken = "";
var client = new Client();
var deferred = require('fk-common-utils').deferred;
var config = require('config');
var request = require('request');
var httpObj = require('http');



router.get('/' ,function (req,res,next) {
    console.log("in controller to get BU");
    var url = urlConfig.buListAPI;
    console.log(url);
    var tokenHash = authClient.login(request,"AccountingTracker");
    // console.log("token hash from main js " +tokenHash);
    tokenHash.pipe(function (result) {
        // updateHeader(result['token']);
        // console.log("result is" + result['token']);
        var args = {
            headers: {
                "Authorization": "Bearer " + result['token'],
                "content-type": "application/json",
                "X_BU_ID": "FKMP"
            }
        };
    
        client.get(url, args, function (data, response) {
    
            // parsed response body as js object
            console.log("result" + JSON.stringify(data));
            // console.log("raw response "+response);
            res.send(data);
            // res.render('error',{title: 'error'});
        });
        return deferred.success(result);
    });
}
);


module.exports = router;
