'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js');

let controller = function(driver, options, callback){
        authFunctions.getUiToken(driver, function(Token){
            if(options.action == 'createApplications'){
                configFunctions.createApplications(options.applications.length, Token, options.applications, [], function(error, applications){
                   callback(driver, applications, error);
                });
            }else if(options.action == 'addResource'){
                configFunctions.getConfiguration(Token, function(error, configuration){
                    if(error){
                        callback(driver, null, error)
                    }
                    let callbackDone = false
                    _.each(configuration, function(app){
                        if(app.name == options.application){
                            configFunctions.addPublishingResource(Token, app, options.resources, function(error, applications){
                                if(!callbackDone){
                                    callbackDone = true;
                                    callback(driver, applications.body, error)
                                }
                            });
                        }
                    })
                });
            }else if(options.action == 'addSubscription'){
                configFunctions.getConfiguration(Token, function(error, configuration){
                    if(error){
                        callback(driver, null, error)
                    }
                    _.each(configuration, function(app){
                        if(app.name == options.application){
                            configFunctions.addSubscribingResource(Token, app, options.subscriptions, function(error, applications){
                                callback(driver, applications.body, error)
                            });
                        }
                    })
                });
            }else if(options.action == 'deleteApplications'){
                 configFunctions.getConfiguration(Token, function(error, configuration){
                    let callbackDone = false;
                    if(error){
                        console.log("Error Calling Configuration Service");
                        callback(driver, null, error)
                    }
                    if(configuration.length == 0){
                        callback(driver)
                    }else{
                    let appsSearched = 0;
                    _.each(configuration, function(app){
                        appsSearched = appsSearched+1;
                        if((options.applications) && (options.applications.indexOf(app.name) !== -1)){
                            configFunctions.deleteApplications(app.id, Token, function(status, error){
                                if((appsSearched == configuration.length) && (!callbackDone)){
                                    callbackDone = true;
                                    callback(driver, status, error);
                                }
                            });
                        }else if(!options.applications){
                            configFunctions.deleteApplications(app.id, Token, function(status, error){
                                if((appsSearched == configuration.length) && (!callbackDone)){
                                    callbackDone = true;
                                    callback(driver, status, error);
                                }
                            });
                        }else if((appsSearched == configuration.length) &&(!callbackDone)){
                            callbackDone = true;
                             callback(driver);
                         }
                    })
                    }
                });

            }else if(options.action == 'addCredentials'){
                  configFunctions.addCredentials(options.appId, options.username, options.password, options.title, Token, function(error, result){
                    if(!error)
                        callback(driver, result);
                    else
                        callback(driver,result,error);
                  });
             }else{
                callback(driver, null, { "msg":"No hub-configuration-api Controller found for: "+options.action });
            }

        });
}

module.exports = exports = {
    controller: controller
}