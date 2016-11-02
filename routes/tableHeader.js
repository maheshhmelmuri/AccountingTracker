/**
 * Created by niyazulla.khan on 29/10/16.
 */

var express = require('express');
var router = express.Router();
var request = require('request');

var https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();
var deferred = require('fk-common-utils').deferred;
var config = require('config');
var clientHelper = require('./../lib/client-helper');

router.get('/',function (req,res,next) {
    // direct way
    console.log("in table header controller");
    var headerDef = eval('config.table_definition.'+req.query.BU);
    console.log("the header def in controller :"+JSON.stringify(headerDef));
    res.send(headerDef);
});

module.exports = router;