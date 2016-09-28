'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    pubFunctions = require('../../lib/pubFunctions.js'),
    errorFunctions = require('../../lib/errorFunctions'),
    adminFunctions = require('../../lib/adminFunctions'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js');

let controller = function(driver, options, callback){
        authFunctions.getUiToken(driver, function(Token){

            //publisher Action for Sending Change Notifications
            if(options.action == 'sendChangeNotifications'){
               //Pulling a Change notification and specifying the Resource
               pubFunctions.createChangeNotification(options.resource, function(CN){
                    configFunctions.getConfiguration(Token, function(error, config){
                        _.each(config, function(conf){
                            //Find configuration that matches the options application
                            if(conf.name == options.application){
                                authFunctions.getAccessToken(conf.apiKey, function(error, accessToken){
                                    if(options.updateModel){
                                        adminFunctions.updateModel(options.updateModel.attributes, CN, function(model){
                                            pubFunctions.sendChangeNotifications(accessToken, model, options.messageCount, [], function(error, results){
                                                if(error){
                                                    callback(driver, { 'text': error });
                                                }else{
                                                    callback(driver, { 'text': results });
                                                }
                                            });
                                        });
                                    } else {
                                        pubFunctions.sendChangeNotifications(accessToken, CN, options.messageCount, [], function(error, results){
                                           callback(driver, { 'text': results });
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            }else if(options.action == 'sendChangeNotificationsExpiredJwt'){
                 //Pulling a Change notification and specifying the Resource
                 pubFunctions.createChangeNotification(options.resource, function(CN){
                      configFunctions.getConfiguration(Token, function(error, config){
                          _.each(config, function(conf){
                              //Find configuration that matches the options application
                              if(conf.name == options.application){
                                  authFunctions.getAccessToken(conf.apiKey, function(error, accessToken){
                                    if(options.updateModel){
                                        adminFunctions.updateModel(options.updateModel.attributes, CN, function(model){
                                            errorFunctions.sendMessageExpiredToken(accessToken, 'publisher', model, function(error, results){
                                                callback(driver, { 'text': error });
                                            });
                                        });
                                    } else {
                                      errorFunctions.sendMessageExpiredToken(accessToken, 'publisher', CN, function(error, results){
                                         callback(driver, { 'text': error });
                                      });
                                    }
                                  });
                              }
                          });
                      });
                  });
            }else{
                console.error("No Publisher Action for: "+options.action)
            }

        });
}

module.exports = exports = {
    controller: controller
}