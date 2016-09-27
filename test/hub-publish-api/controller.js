'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    pubFunctions = require('../../lib/pubFunctions.js'),
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
                                    pubFunctions.sendChangeNotifications(accessToken, CN, options.messageCount, [], function(error, results){
                                        callback(results);
                                     });
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