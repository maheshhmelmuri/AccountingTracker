var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customAccJParser = require('./customAccrualJsonParser');
var customAccInvoiceJParser = require('./customAccInvoiceJsonParser');
var customInvoiceIDParser = require('./customInvoiceIDParser');
var deferred = require('fk-common-utils').deferred;
var header = {};
var rawJson = null;
var invoiceIds = [];


router.get('/',function (req,res,next) {

    var paramHash = {};
    var localParamHash = {};
    var invOutput = {};
    localParamHash["invoice_id"] = req.query.id;
    var rawJsonInt = {};
    var invIdParser = {};
    var result = clientHelper.getHelper().execute('get',header,req.query.accrualType,req.query.BU, localParamHash);
    return result.pipe(function (result) {
        rawJsonInt = JSON.stringify(result);
        console.log("result1 for accrual type :"+req.query.accrualType+" ...." + rawJsonInt);
        invIdParser = customInvoiceIDParser.customInvoiceIDParser(rawJsonInt);
        console.log("invIdParser:"+JSON.stringify(invIdParser));
        deferred.success(res.send(invIdParser));
    });
});

module.exports = router;