/**
 * Created by ashrith.kulai on 17/08/15.
 */

/*jshint globalstrict: true, bitwise: false */
/*global require: true, exports: true */
'use strict';

var jwt = require('jsonwebtoken'),
    deferred = require('fk-common-utils').deferred,
    fs = require('fs'),
    // logger = require('../utils/logger.js').getLoggerFor("AUTHN"),
    uuid = require('node-uuid'),
    path = "/Users/niyazulla.khan/niyazulla/work/keys/myservice.pem",
    privateKey = fs.readFileSync(path);;
var tokenHash = {};
function AuthnClient() {
    this.data = {};
    this.clientAssertion;
}

AuthnClient.prototype.login = function (request, destClientId) {
    console.log("in login");
    var authnConfig = {
        useAuthN: true,
        clientId: "AccontingTracker",
        authnUrl: "http://10.85.50.5",
        serviceUrl: "AccountingTracker",
        privateKeyPath: "/Users/niyazulla.khan/niyazulla/work/keys/myservice.pem",
        timeSkewAllowance: 300000
    };
    var tokenUrl = authnConfig.authnUrl + "/token";

    function isExpired(token) {
        return (new Date().getTime() + authnConfig.timeSkewAllowance) > token.exp;
    }

    function isSuccessCode(statusCode) {
        return statusCode >= 200 && statusCode < 300;
    }

    function createClientAssertion() {
        var issueTime = Math.floor(new Date().getTime() / 1000);
        var expiryTime = issueTime + 3600;

        var payload = {
            iss: authnConfig.clientId,
            aud: tokenUrl,
            iat: issueTime,
            exp: expiryTime,
            nbf: issueTime,
            scope: destClientId,
            jti: uuid.v4()
        };

        return jwt.sign(payload, privateKey, {algorithm: 'RS256'});
    }

    function fetchAuthorizationToken(clientAssertion) {
        console.log("authToken start");
        return deferred.defer(function (callbacks) {
            console.log("callback");
            var finalTokenUrl = tokenUrl + "?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + clientAssertion;
            request.get(finalTokenUrl, function (error, response, body) {
                if (error === null && (isSuccessCode(response.statusCode))) {
                    // logger.info("Logged in successfully for ", destClientId);
                    body = JSON.parse(body);
                    tokenHash['token'] = body.access_token;
                    tokenHash['exp'] = (body.expires_in * 1000 + new Date().getTime());
                    // logger.debug(body);
                    callbacks.success({token: body.access_token,
                        exp: (body.expires_in * 1000 + new Date().getTime())
                    });
                } else {
                    // logger.error("Failed to fetch id token: ", response.body);
                    callbacks.failure({
                        kind: "GetFailed",
                        statusCode: response && response.statusCode,
                        text: body
                    });
                }
            })
        });
    }

    function refreshToken(self) {
        if(!authnConfig.useAuthN){
            // logger.info("Auth is diabled via config");
            return deferred.failure({});
        }
        console.log("refresh token");
        // logger.info("Refreshing access token " + (self.data.token ? isExpired(self.data.token) : ""));
        if (!self.data.token || isExpired(self.data.token)) {
            if (!self.clientAssertion) {
                self.clientAssertion = createClientAssertion(authnConfig.privateKeyPath, destClientId);
                // console.log("client Assertion "+self.clientAssertion);
                var fetchAuthD = fetchAuthorizationToken(self.clientAssertion);
                return fetchAuthD.pipe(function (token) {
                    // console.log("token :"+JSON.stringify(token));
                    self.data.token = token;
                    return deferred.success(token);
                });
            }
        }
        self.clientAssertion = null;
        console.log("token hash: "+JSON.stringify(tokenHash));
        return deferred.success(self.data.token);
    }
    var self = this;
    var refreshTokenD = refreshToken(self);
    console.log("refreshToken :" + JSON.stringify(refreshTokenD));
    if(!self.loginD) {
        self.loginD = refreshTokenD.pipe(function (result) {
            console.log("token is :"+JSON.stringify(result));
            request= request.defaults({
                headers: {'Authorization': 'Bearer ' + result.token}
            });
            // request.updateHeaders({
            //     'Authorization': 'Bearer ' + result.token
            // });
            console.log("request: "+JSON.stringify(request.default));
            self.loginD = null;
            return deferred.success(result);
        });
    }
    console.log("self.logind :" + JSON.stringify(self.loginD));
    return self.loginD;
};

exports.getAuthnClient = function () {
    return new AuthnClient();
};

exports.getTokenHash = function () {
    return self.tokenHash;
};