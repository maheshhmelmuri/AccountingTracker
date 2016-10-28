var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();
var deferred = require('fk-common-utils').deferred;
var authnConfig = require('../../lib/authn-config');
var customInvJParser = require('./customInvoiceJsonParser');
var urls = require('../URL');
var authClient = require('../../lib/authn-login-client').getAuthnClient();
var rawJson = null;

router.get('/',function (req,res,next) {
    var url = "http://10.85.50.152:80/v1/invoice/type/payable_debit_note?external_ref_id="+req.query.id;
    var tokenHash = authClient.login(request,authnConfig.clientId);
    tokenHash.pipe(function (result) {
        var args = {
            headers: {
                "X_BU_ID": "EKL",
                "Authorization": "Bearer " + result['token'],
                "content-type": "application/json"
            }
        };

        client.get(url, args, function (data, response) {
            console.log("in pdn");
            rawJson = JSON.stringify(data);
            console.log(customInvJParser.customInvJParser(rawJson));
            res.send(data);
            // res.render('error',{title: 'error'});
        });
        return deferred.success(result);
    });

});


module.exports = router;
