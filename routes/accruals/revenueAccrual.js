var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customAccJParser = require('./customAccrualJsonParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in racc");
    var paramHash = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'invoice_racc',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var racc = {};
        racc["revenue_accrual"] = customAccJParser.customAccJParser(rawJson);
        console.log("final revenue output: "+ JSON.stringify(racc));
        deferred.success(res.send(racc));
    });
});

module.exports = router;