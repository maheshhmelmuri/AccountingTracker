var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customInvJParser = require('./customInvoiceJsonParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in pdn");
    var paramHash = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'invoice_pdn',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var pdn = {};
        pdn = customInvJParser.customInvJParser(rawJson);
        console.log("final pdn output: "+ JSON.stringify(pdn));
        deferred.success(res.send(pdn));
    });
});

module.exports = router;