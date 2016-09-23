'use strict';

const authFunctions = require('../../lib/authFunctions.js'),
    adminFunctions = require('../../lib/adminFunctions'),
    errorMessage = require('../../framework/error'),
    errorFunctions = require('../../lib/errorFunctions');

//Controller for error-reporting-service
let controller = function(driver, options, callback){
        authFunctions.getUiToken(driver, function(Token){
            if(options.actions = 'sendErrorMessage'){
                if(options.updateModel){
                    adminFunctions.updateModel(options.updateModel.attributes, errorMessage, function(model){
                        errorFunctions.sendErrorMessages(Token, model, 1, [], function(error, results){
                        console.error('=========================================')
                            callback(driver, { 'text': results } , error);
                        });
                    });
                }else{
                    errorFunctions.sendErrorMessages(Token, errorMessage, 1, [], function(error, results){
                        callback(driver, { 'text': results } , error);
                    });
                }
            }else if(options.actions = 'sendErrorMessageBadMediaType'){
              if(options.updateModel){
                  adminFunctions.updateModel(options.updateModel.attributes, errorMessage, function(model){
                      errorFunctions.sendErrorMessagesBadMediaType(Token, model, function(error, results){
                          callback(driver, { 'text': results } , error);
                      });
                  });
              }else{
                  errorFunctions.sendErrorMessagesBadMediaType(Token, errorMessage, function(error, results){
                      callback(driver, { 'text': results } , error);
                  });
              }
            }else{
                callback(driver, null, { "msg":"No error-reporting-service Controller found for: "+options.action })
            }
        });
}

module.exports = exports = {
    controller: controller
}