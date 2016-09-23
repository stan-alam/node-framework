'use strict';

const _ = require('lodash'),
    async = require('async'),
    authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    mqsFunctions = require('../../lib/mqsFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js');

let mqsLoopConsume = function(accessToken, options, index, lastid, results, consumeall, loopCallback) {
    let endpoint = '';
    if (index == options.messageCounts.length) {
        loopCallback(results)
    } else {
        if (lastid > 0) {
            lastid = lastid + options.messageCounts[index];
        }
        if (accessToken) {
            if (consumeall) {
                endpoint = 'callConsumeAll';
            } else {
                endpoint = 'callConsume';
            }
            mqsFunctions[endpoint](accessToken, lastid, function(error, mqsResults) {
                results.push(mqsResults);
                let newlastId = mqsResults.body[mqsResults.body.length - 1].id;
                mqsLoopConsume(accessToken, options, (index + 1), newlastId, results, consumeall, loopCallback);
            });
        } else {
            loopCallback(results);
        }
    }
}

let controller = function(driver, options, callback) {
    authFunctions.getUiToken(driver, function(Token) {

        //Calling Action of consumeChangeNotifications
        if (options.action == 'consumeChangeNotifications') {
            configFunctions.getConfiguration(Token, function(error, config) {
                _.each(config, function(conf) {
                    if (conf.name == options.application) {
                        authFunctions.getAccessToken(conf.apiKey, function(error, accessToken) {
                            console.error(accessToken)
                            mqsLoopConsume(accessToken, options, 0, 0, [], false, function(result) {
                                callback(result);
                            });
                        });
                    }
                });
            });
        } else if (options.action == 'postFlagFalse') {
            configFunctions.getConfiguration(Token, function(error, config) {
                _.each(config, function(conf) {
                    if (conf.name == options.application) {
                        authFunctions.getAccessToken(conf.apiKey, function(error, accessToken) {
                            mqsLoopConsume(accessToken, options, 0, 0, [], true, function(result) {
                                callback(result);
                            });
                        });
                    }
                });
            });

        } else if (options.action == 'consumeAllOneStatusCode') {
            configFunctions.getConfiguration(Token, function(error, config) {
                authFunctions.getEPAtoken(Token, function(error, JWT){
                mqsFunctions.callConsumeAll(JWT, 0, function(error, result) {
                    if (error) {
                        callback(driver, { 'text': error.statusCode }, error)
                    } else {
                        callback(driver, {  'text': result.statusCode }, error)
                    }
                })
            });

        });

        } else if (options.action == 'consumeAllOneStatusText'){
            configFunctions.getConfiguration(Token, function(error, config){
                authFunctions.getEPAtoken(Token, function(error, JWT) {
                    mqsFunctions.callConsumeAll(JWT, 0, function(error, result) {
                        if ( error ) {
                            callback(driver, { 'text' : error.body }, error)
                        } else {
                            callback(driver, { 'text': result.body }, error)
                       }
                  })
             });

        });



    } else {
            console.error("MQS Controller has No Action: " + options.action)
        }
    });
}

module.exports = exports = {
    controller: controller
}