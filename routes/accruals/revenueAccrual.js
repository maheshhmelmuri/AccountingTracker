var express = require('express');
var router = express.Router();
var clientHelper = require('../../lib/client-helper');
var customAccJParser = require('./customAccrualJsonParser');
var header = {};
var buId = "FKMP";
var rawJson = null;

router.get('/',function (req,res,next) {
    // direct way
    console.log("in pdn");
    var result = clientHelper.getHelper().execute('get',header,'revenue_accrual',buId);
    return result.pipe(function(token) {
        //console.log("api first result sent below "+ JSON.stringify(result));
        rawJson = JSON.stringify(result);
        console.log(customAccJParser.customAccJParser(rawJson));
        res.send(token);
    });
});


module.exports = router;
