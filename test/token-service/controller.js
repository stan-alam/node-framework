'use strict';

const authFunctions = require('../../lib/authFunctions.js'),
    adminFunctions = require('../../lib/adminFunctions'),
    errorMessage = require('../../framework/error'),
    errorFunctions = require('../../lib/errorFunctions');

//Controller for Token Service
let controller = function(driver, options, callback){
        authFunctions.getUiToken(driver, function(Token){
            if(options.action == 'getAccessToken'){
                authFunctions.getAccessToken(options.apikey, function(error, result){
                    callback(driver, { 'text': error || result });
                });
            }else if(options.action == 'openAccessToken'){
                authFunctions.getAccessToken(options.apikey, function(error, accessToken){
                    authFunctions.openJwt(accessToken, function(error, result){
                        callback(driver, { 'text': result }, error);
                    });
                });
            }else if(options.action == 'getAccessTokenBadEndpoint'){
                errorFunctions.sendMessageBadEndpoint(options.apikey, '/auths', {}, function(error, result){
                    callback(driver, { 'text': result }, error);
                });
            }else if(options.action == 'getAccessTokenBadMethod'){
                authFunctions.getAccessTokenBadMethod(options.apikey, function(error){
                        callback(driver, { 'text': error });
                });
            }else if(options.action == 'getAccessTokenNoHeader'){
                  authFunctions.getAccessTokenNoHeader(options.apikey, function(error, result){
                      callback(driver, { 'text': result }, error);
                  });
            }else{
                callback(driver, null, { "msg":"No error-reporting-service Controller found for: "+options.action })
            }
        });
}

module.exports = exports = {
    controller: controller
}