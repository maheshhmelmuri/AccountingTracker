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
    console.log("in racc");
    var paramHash = {};
    var localParamHash = {};
    var invOutput = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'revenue_accrual',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var racc = {};
        racc = customAccJParser.customAccJParser(rawJson,req.query.BU);
        console.log("final revenue output: "+ JSON.stringify(racc));
        deferred.success(res.send(racc));
    });
});

module.exports = router;