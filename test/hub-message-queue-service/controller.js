'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    mqsFunctions = require('../../lib/mqsFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js');

let controller = function(driver, options, callback){
    authFunctions.getUiToken(driver, function(Token){

        //Calling Action of consumeChangeNotifications
        if(options.action == 'consumeChangeNotifications'){
                configFunctions.getConfiguration(Token, function(error, config){
                    _.each(config, function(conf){
                        if(conf.name == options.application){
                            authFunctions.getAccessToken(conf.apiKey, function(error, accessToken){
                                mqsFunctions.callConsume(accessToken, 0, function(error, results){
                                    mqsFunctions.callConsume(accessToken, 10, function(error, results){
                                            callback(results);
                                    });
                                 });
                            });
                        }
                    });
                });
        }else if(options.action == 'consumeAll'){
                configFunctions.getConfiguration(Token, function(error, config){
                    _.each(config, function(conf){
                        if(conf.name == options.application){
                            authFunctions.getAccessToken(conf.apiKey, function(error, accessToken){
                                mqsFunctions.callConsume(accessToken, 0, function(error, results){
                                    mqsFunctions.callConsume(accessToken, 10, function(error, results){
                                            callback(results);
                                    });
                                 });
                            });
                        }
                    });
                });
        }else{
            console.error("MQS Controller has No Action: "+ options.action)
        }
    });
}

module.exports = exports = {
    controller: controller
}