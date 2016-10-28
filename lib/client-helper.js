/**
 * Created by niyazulla.khan on 27/10/16.
 */
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();

var https = require('https');
var authClient = require('./../lib/authn-login-client').getAuthnClient();
var authnToken = "";
var deferred = require('fk-common-utils').deferred;
var config = require('config');
var request = require('request');
var httpObj = require('http');
var authnConfig = require('./authn-config');
var ClientHelper = ClientHelper || {};
var $ = require('jquery');
var header = {};
var finalResult = {};


ClientHelper = {
    // finalResult: {},
    updateHeader: function(headerHash) {
        //console.log("in update headers");
        header["headers"] = {};
        // console.log(JSON.stringify);
        header["headers"]["content-type"] = "application/json";
        if(headerHash != null) {
            console.log("headers is null");
            for(var key in headerHash) {
                header["headers"][key] = headerHash[key];
            }
        }
},
    fetchUrl: function(externalSystem, BU, searchId) {
        console.log("fetching url");
        // url = config.EKL_url.buList;
        console.log("the eval function: "+'config.'+BU+'_url.'+externalSystem);
        var url = eval('config.'+BU+'_url.'+externalSystem);
        console.log("url from client is"+url);
        return url;
},
    getToken: function() {
        console.log("fetching token");
        return authClient.login(request,authnConfig.clientId); //move this client ID to config
},
    getData: function (headerHash, url, BU) {
        console.log("in client get function");
        var tokenHash = ClientHelper.getToken();
        return tokenHash.pipe(function (result) {
            headerHash['Authorization'] = "Bearer " + result['token'];
            headerHash['X_BU_ID'] = BU.toString();
            var args = ClientHelper.updateHeader(headerHash);
            console.log("the args in client getData function " + JSON.stringify(header));
            finalResult = {};
           return deferred.defer(function(callbacks){
               client.get(url, header, function (data, response) {
                   console.log("result in the client Helper getData function : " + JSON.stringify(data));
                   finalResult = data;
                   callbacks.success({resultData:data});
               });
           }); 
        });
},
    execute: function(callType, header, externalSystem, BU, searchId) {
        console.log("in execute");
        var functionToCall = callType+"Data"; //getData or postData
        console.log("function to call :"+functionToCall);
        var url = this.fetchUrl(externalSystem, BU);
        console.log("url to fetch: "+url);
        var resultToken = ClientHelper.getData(header, url, BU); //change it to generid
        return resultToken.pipe(function(token){
            console.log("the retuned data "+JSON.stringify(finalResult));
            return deferred.success(finalResult);
        });

}
};

exports.getHelper =  function() {
    return ClientHelper;
};

