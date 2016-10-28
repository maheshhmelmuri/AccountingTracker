var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customInvJParser = require('./customInvoiceJsonParser');
var header = {};
var buId = "FKMP";
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in pdn");
    var result = clientHelper.getHelper().execute('get',header,'invoice_pdn',buId);
    return result.pipe(function(token) {
        //console.log("api first result sent below "+ JSON.stringify(result));
        rawJson = JSON.stringify(result);
        console.log(customInvJParser.customInvJParser(rawJson));
        res.send(token);
    });
});


module.exports = router;
