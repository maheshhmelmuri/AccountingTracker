/**
 * Created by niyazulla.khan.
 */

/*jshint globalstrict: true, bitwise: false */
/*global require: true, exports: true */
'use strict';

var authConfig = require('./authn-config'),
    config = require('config'),
    jwt = require('jsonwebtoken'),
    deferred = require('fk-common-utils').deferred,
    fs = require('fs'),
    uuid = require('node-uuid'),
    path = authConfig.privateKeyPath,
    privateKey = fs.readFileSync(path);
    var tokenHash = {};

    function AuthnClient() {
    this.data = {};
    this.clientAssertion;
}

AuthnClient.prototype.login = function (request, destClientId) {
    console.log("in login");
    // console.log(config.summaryTable.id);
    var authnConfig = {
        useAuthN: true,
        clientId: authConfig.clientId,
        authnUrl: authConfig.authnUrl,
        serviceUrl: authConfig.serviceUrl,
        privateKeyPath: authConfig.privateKeyPath,
        timeSkewAllowance: authConfig.timeSkewAllowance
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
            // console.log("callback");
            // console.log(typeof  callbacks);
            var finalTokenUrl = tokenUrl + "?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + clientAssertion;
            request.get(finalTokenUrl, function (error, response, body) {
                if (error === null && (isSuccessCode(response.statusCode))) {
                    console.log("creating a token");
                    body = JSON.parse(body);
                    tokenHash['token'] = body.access_token;
                    tokenHash['exp'] = (body.expires_in * 1000 + new Date().getTime());
                    callbacks.success({token: body.access_token,
                        exp: (body.expires_in * 1000 + new Date().getTime())
                    });
                } else {
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
            return deferred.failure({});
        }
        console.log("refresh token");
        if (!tokenHash['token'] || isExpired(tokenHash['exp'])) {
            if (!self.clientAssertion) {
                self.clientAssertion = createClientAssertion(authnConfig.privateKeyPath, destClientId);
                var fetchAuthD = fetchAuthorizationToken(self.clientAssertion);
                console.log( typeof fetchAuthD );
                return fetchAuthD.pipe(function (token) {
                    console.log( typeof token );
                    self.data.token = token;
                    return deferred.success(token);
                });
            }
        }
        self.clientAssertion = null;
        //console.log("token hash: "+JSON.stringify(self));
        return deferred.success(tokenHash);
        // return tokenHash;
    }
    var self = this;
    var refreshTokenD = refreshToken(self);
    //console.log("refreshToken :" + JSON.stringify(refreshTokenD));
    if(!self.loginD) {
        self.loginD = refreshTokenD.pipe(function (result) {
            self.loginD = null;
            return deferred.success(result);
        });
    }
    //console.log("self.logind :" + JSON.stringify(self.loginD));
    return self.loginD;
};

exports.getAuthnClient = function () {
    return new AuthnClient();
};

exports.getTokenHash = function () {
    return self.tokenHash;
};