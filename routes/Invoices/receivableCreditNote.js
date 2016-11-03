var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customInvJParser = require('./customInvoiceJsonParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in rcn");
    paramHash = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'invoice_rcn',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var rcn = {};
        rcn = customInvJParser.customInvJParser(rawJson);
        console.log("final rcn output: "+ JSON.stringify(rcn));
        deferred.success(res.send(rcn));
    });
});

module.exports = router;
