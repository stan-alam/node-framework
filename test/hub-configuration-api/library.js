'use strict';

const _ = require('lodash'),
    authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js');

let controller = function(driver, options, callback){
        authFunctions.getUiToken(driver, function(Token){
            if(options.action == 'createApplications'){
                configFunctions.createApplications(options.applications.length, Token, options.applications, [], function(error, applications){
                   callback(applications);
                });
            }else if(options.action == 'addResource'){
                configFunctions.getConfiguration(Token, function(error, configuration){
                    _.each(configuration, function(app){
                        if(app.name == options.application){
                            configFunctions.addPublishingResource(Token, app, options.resources, function(error, applications){
                                callback(applications)
                            });
                        }
                    })
                });
            }else if(options.action == 'addSubscription'){
                configFunctions.getConfiguration(Token, function(error, configuration){
                    _.each(configuration, function(app){
                        if(app.name == options.application){
                            configFunctions.addSubscribingResource(Token, app, options.subscriptions, function(error, applications){
                                callback(applications)
                            });
                        }
                    })
                });
            }else if(options.action == 'deleteApplications'){
                 configFunctions.getConfiguration(Token, function(error, configuration){
                    var doneWithFirst = false;
                    if(configuration.length == 0)
                        callback(done)
                    _.each(configuration, function(app){
                        configFunctions.deleteApplications(app.id, Token, function(done){
                            if(!doneWithFirst){
                                doneWithFirst = true;
                                callback(done)
                            }
                        });
                    })
                });
            }
        });
}

module.exports = exports = {
    controller: controller
}