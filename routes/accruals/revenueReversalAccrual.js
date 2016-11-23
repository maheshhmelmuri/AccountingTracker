/**
 * Created by mahesh.melmuri on 11/11/16.
 */

var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customAccJParser = require('./customAccrualJsonParser');
var customAccInvoiceJParser = require('./customAccInvoiceJsonParser');
var customInvoiceIDParser = require('./customInvoiceIDParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;


router.get('/',function (req,res,next) {
    // direct way
    console.log("in rracc");
    var paramHash = {};
    var localParamHash = {};
    var invOutput = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'revenue_reversal_accrual',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var rracc = {};
        rracc = customAccJParser.customAccJParser(rawJson,req.query.BU);
        console.log("final revenue reversal output: "+ JSON.stringify(rracc));
        deferred.success(res.send(rracc));
    });
});

module.exports = router;