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


        //invoiceIds = customAccInvoiceJParser.customAccInvoiceJParser(rawJson).toArray();
        // console.log("length"+invoiceIds.length);
        // for(var i=0;i<invoiceIds.length;i++)
        // {
        //     console.log("value of i is:"+i +"value of :"+invoiceIds[i]);
        //     console.log("invids"+invoiceIds[i]);
        // }

        // for(var i=0;i<invoiceIds.length;i++)
        // {
        //     localParamHash["invoice_id"] = invoiceIds[i];
        //     var rawJsonInt = {};
        //     var invIdParser = {};
        //     var result1 = clientHelper.getHelper().execute('get',header,'revenue_accrual_invoice',req.query.BU, localParamHash);
        //     result1.pipe(function (result) {
        //         rawJsonInt = JSON.stringify(result);
        //         //console.log("result1"+rawJsonInt);
        //         invIdParser = customInvoiceIDParser.customInvoiceIDParser(rawJsonInt);
        //         console.log("invIdParser:"+JSON.stringify(invIdParser));
        //         console.log("in value of i is:"+i +"in value of :"+invoiceIds[i]);
        //         invOutput[invoiceIds[i]]= invIdParser;
        //         console.log("deferred"+deferred.success());
        //         return deferred.success();
        //         console.log("aftersuccess");
        //         //console.log("invOutput:"+JSON.stringify(invOutput));
        //         console.log("invOutput:"+JSON.stringify(invOutput));
        //     });
        //
        // }

        //console.log("invOutput:"+JSON.stringify(invOutput));
        racc = customAccJParser.customAccJParser(rawJson);
        console.log("final revenue output: "+ JSON.stringify(racc));
        deferred.success(res.send(racc));
    });
});

module.exports = router;