'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js'),
    errorFunctions = require('../../lib/errorFunctions.js'),
    errorsPayLoad = require('../../framework/error.json'),
    adminFunctions = require('../../lib/adminFunctions');

let controller = function(driver, options, callback) {
    console.log("These are the options for line 10" + JSON.stringify(options));
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
                     console.log("This is the options " + JSON.stringify(options));
                     callback(driver, {'text': result.body.message }, error);
                });
            });
        } else if (options.action == 'setInvalidEndPoint'){
            authFunctions.openJwt(Token, function(error, openToken){
                console.error('openToken: '+ JSON.stringify(openToken))
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
                console.error('openToken: '+ JSON.stringify(openToken))
                errorFunctions.sendMessageBadEndpointPost(Token, options.endPoint, function(error) {
                     if(error){
                        callback(driver, {'text': error.statusCode });
                     }
                });
            });
        } else if (options.action == 'sendPermissionsInvalidPayload'){

            console.log("This is the token" + Token);

            authFunctions.getEPAtoken(Token, function(error, jwt) {
                authFunctions.openJwt(Token, function(error, openToken) {

                console.log("This is the token from thisToken " + Token);

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

            console.log("This is the token" + Token);

            authFunctions.getEPAtoken(Token, function(error, jwt) {
                authFunctions.openJwt(Token, function(error, openToken) {

                console.log("This is the token from thisToken " + Token);

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