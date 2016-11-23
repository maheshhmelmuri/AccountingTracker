var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customAccJParser = require('./customAccrualJsonParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in cacc");
    var paramHash = {};
    paramHash[req.query.type] = req.query.id;
    var result = clientHelper.getHelper().execute('get',header,'cost_accrual',req.query.BU, paramHash);
    return result.pipe(function(result) {
        rawJson = JSON.stringify(result);
        var cacc = {};
        cacc = customAccJParser.customAccJParser(rawJson,req.query.BU);
        console.log("final cost output: "+ JSON.stringify(cacc));
        deferred.success(res.send(cacc));
    });
});

module.exports = router;