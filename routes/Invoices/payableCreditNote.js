var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customInvJParser = require('./customInvoiceJsonParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in pcn");
    paramHash = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'invoice_pcn',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var pcn = {};
        pcn = customInvJParser.customInvJParser(rawJson,req.query.BU);
        console.log("final pcn output: "+ JSON.stringify(pcn));
        deferred.success(res.send(pcn));
    });
});

module.exports = router;
