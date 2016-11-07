var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customSummaryParser = require('./customSummaryParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in summary");
    var paramHash = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'invoice_pdn',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var summary = {};
        summary = customSummaryParser.customSummaryParser(rawJson,req.query.id);
        console.log("final summary output: "+ JSON.stringify(summary));
        deferred.success(res.send(summary));
    });
});

module.exports = router;