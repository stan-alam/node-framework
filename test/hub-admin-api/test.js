'use strict';

const authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js'),
    mqsFunctions = require('../../lib/mqsFunctions.js'),
    adminFunctions = require('../../lib/adminFunctions.js'),
    pubFunctions = require('../../lib/pubFunctions.js'),
    randomstring = require("randomstring"),
    envVars = require('../../framework/environments');

global.assert = require('assert');

function consumeAllClearing(accessToken, callback){
    authFunctions.convertConsumeAll(accessToken, function(error, consumeToken){
        if(error){
            console.error(error);
            process.exit();
        }else{
            mqsFunctions.callConsumeAll(consumeToken, function(error, response){
                if(error){
                    console.error(error);
                    process.exit();
                }else{
                    if(response.length > 0){
                        consumeAllClearing(callback);
                    }else{
                        callback(response);
                    }
                }
            });
        }
    });
};


describe("Running hub-admin-api Integration Tests", function() {
  let driver, uiToken, accessToken = '';
  let resourceName = 'subjects';
  let pubApplication, subApplication = [];

  before(function(done){
    this.timeout(1500000);
    uiFunctions.loadUi(function(uiDriver){
        driver = uiDriver;
        authFunctions.getUiToken(driver, function(Token){
            uiToken = Token;
            configFunctions.createApplications(2, uiToken, [], function(error, applications){
                if(error){
                    console.error("Error: "+error);
                    process.exit();
                }else{
                    configFunctions.addPublishingResource(uiToken, applications[0], resourceName, function(error, application){
                        if(error){
                            console.error("Error: "+error);
                            process.exit();
                        }else{
                            pubApplication = application;
                            configFunctions.addSubscribingResource(uiToken, applications[1], resourceName, function(error, application){
                            if(error){
                                console.error("Error: "+error);
                                process.exit();
                            }else{
                                subApplication = application;
                                 authFunctions.getAccessToken(pubApplication.apiKey, function(error, returnAccessToken){
                                     if(error){
                                         console.error('Error: '+error);
                                         process.exit();
                                     }else{
                                         accessToken = returnAccessToken;
                                     }
                                 });
                            }
                            });
                        }
                    });

                }
            });
            done();
        });
    });
  });

  after(function(done){
    configFunctions.deleteApplications(pubApplication.id, uiToken);
    configFunctions.deleteApplications(subApplication.id, uiToken);
    driver.quit();
    done();
  });

  it("All are consumed from /consumeAll", function(done){
    consumeAllClearing(accessToken, function(response){
        assert.equal(response.length, 0);
        done();
    });
  });

  it("Enable dataAccess", function(done){
    adminFunctions.dataAccessFlag(accessToken, 'enable', function(error, response){
        if(error){
            console.error(error.getBody('utf8'));
            done();
        }else{
            assert.equal(response.msg, 'permissions updated');
            done();
        }
    });
  });

 it("Send 3 Change Notifications with dataAccess Enable",function(done){
    pubFunctions.createChangeNotification(resourceName, function(genChangeNotification){
        assert(genChangeNotification);

        done();
    });
 });

 it("disable dataAccess", function(done){
    adminFunctions.dataAccessFlag(accessToken, 'disable', function(error, response){
        if(error){
            console.error(error.getBody('utf8'));
            done();
        }else{
            assert.equal(response.msg, 'permissions updated');
            done();
        }
    });
  });
});
