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
                errorFunctions.sendMessageBadEndpoint(Token, options.endPoint + openToken.tenant.id, function(error, result) {
                     if(error){
                        callback(driver, {'text': error.statusCode });
                     }else{
                        callback(driver, {'text': result.statusCode }, error);
                     }
                });
            });
        } else if (options.action == 'addResource') {
            configFunctions.getConfiguration(Token, function(error, configuration) {
                _.each(configuration, function(app) {
                    if (app.name == options.application) {
                        configFunctions.addPublishingResource(Token, app, options.resources, function(error, applications) {
                            callback(applications.body)
                        });
                    }
                })
            });
        } else if (options.action == 'addSubscription') {
            configFunctions.getConfiguration(Token, function(error, configuration) {
                _.each(configuration, function(app) {
                    if (app.name == options.application) {
                        configFunctions.addSubscribingResource(Token, app, options.subscriptions, function(error, applications) {
                            callback(applications.body)
                        });
                    }
                })
            });
        } else if (options.action == 'deleteApplications') {
            configFunctions.getConfiguration(Token, function(error, configuration) {
                if (error) {
                    console.log("Error Calling Configuration Service");
                    process.exit()
                }
                if (configuration.length == 0) {
                    callback(driver)
                } else {
                    let appsSearched = 0;
                    _.each(configuration, function(app) {
                        appsSearched = appsSearched + 1;
                        if ((options.applications) && (options.applications.indexOf(app.name) !== -1)) {
                            configFunctions.deleteApplications(app.id, Token, function(status) {
                                if (appsSearched == configuration.length) {
                                    callback(status);
                                }
                            });
                        } else if (!options.applications) {
                            configFunctions.deleteApplications(app.id, Token, function(status) {
                                if (appsSearched == configuration.length) {
                                    callback(status);
                                }
                            });
                        } else if (appsSearched == configuration.length) {
                            callback();
                        }
                    })
                }
            });
        }
    });
}

module.exports = exports = {
    controller: controller
}