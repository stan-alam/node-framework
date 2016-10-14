'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js'),
    errorFunctions = require('../../lib/errorFunctions.js'),
    errorsPayLoad = require('../../framework/error.json'),
    adminFunctions = require('../../lib/adminFunctions');

let controller = function(driver, options, callback) {
   authFunctions.getUiToken(driver, function(Token) {
        if (options.action == 'createApplications') {
            configFunctions.createApplications(options.applications.length, Token, options.applications, [], function(error, applications) {
                callback(driver, applications);
            });
        } else if (options.action == 'setPermissionsStatusCode'){
            authFunctions.getEPAtoken(Token, function(error, jwt){
                adminFunctions.allTenantsFlag(jwt, options.setPermissions, function(error, result) {
                     if (error) {
                       callback(driver, {'text': error.statusCode });
                     } else {
                         callback(driver, {'text': result.statusCode }, error);
                    }
                });
            });
        } else if (options.action == 'setPermissionsStatusText'){
            authFunctions.getEPAtoken(Token, function(error, jwt){
                adminFunctions.allTenantsFlag(jwt, options.setPermissions, function(error, result) {
                     callback(driver, {'text': result.body.message }, error);
                });
            });
        } else if (options.action == 'setInvalidEndPoint'){
            authFunctions.openJwt(Token, function(error, openToken){
                errorFunctions.sendMessageBadEndpoint(Token, (options.endPoint + openToken.tenant.id), function(error, result) {
                     if(error){
                        callback(driver, {'text': error.statusCode });
                     }else{
                        callback(driver, {'text': result.statusCode }, error);
                     }
                });
            });
        } else if (options.action == 'noTenantIDEndPoint') {
            authFunctions.openJwt(Token, function(error, openToken){
                errorFunctions.sendMessageBadEndpointPost(Token, options.endPoint, function(error) {
                     if(error){
                        callback(driver, {'text': error.statusCode });
                     }
                });
            });
        } else if (options.action == 'sendPermissionsInvalidPayload'){
            authFunctions.getEPAtoken(Token, function(error, jwt) {
                authFunctions.openJwt(Token, function(error, openToken) {
                errorFunctions.sendPermissionsInvalidPayload(jwt, (options.endPoint + openToken.tenant.id), function(error, result) {
                     if(error){
                        callback(driver, {'text': error.statusCode });
                     }else{
                        callback(driver, {'text': result.statusCode }, error);
                     }
                });
            });
          });
        } else if (options.action == 'sendPermissionsNoPayload'){
            authFunctions.getEPAtoken(Token, function(error, jwt) {
                authFunctions.openJwt(Token, function(error, openToken) {
                errorFunctions.sendPermissionsInvalidPayload(jwt, (options.endPoint + openToken.tenant.id), function(error, result) {
                     if(error){
                        callback(driver, {'text': error.statusCode });
                     }else{
                        callback(driver, {'text': result.statusCode }, error);
                     }
                });
            });
          });
        }
    });
}

module.exports = exports = {
    controller: controller
}