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

function consumeAllClearing(accessToken, lastId, callback){
    authFunctions.convertConsumeAll(accessToken, function(error, consumeToken){
        if(error){
            console.error(error);
            process.exit();
        }else{
            mqsFunctions.callConsumeAll(consumeToken, lastId, function(error, response){
                if(error){
                    console.error(error);
                    process.exit();
                }else{
                    if(response.length > 0){
                        consumeAllClearing(accessToken, parseInt(response[response.length-1].id), callback);
                    }else{
                        callback(response, lastId);
                    }
                }
            });
        }
    });
};


describe("Running hub-admin-api Integration Tests", function() {
  let driver, uiToken, accessToken, subAccessToken = '';
  let resourceName = 'subjects';
  let lastConsumeAllId = 0;
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
                                authFunctions.getAccessToken(subApplication.apiKey, function(error, returnAccessToken){
                                     if(error){
                                         console.error('Error: '+error);
                                         process.exit();
                                     }else{
                                         subAccessToken = returnAccessToken;
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
    consumeAllClearing(accessToken, 0, function(response, lastId){
        lastConsumeAllId = lastId;
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
    this.timeout(1500000);
    authFunctions.getAccessToken(pubApplication.apiKey, function(error, enabledToken){
      if(error){
          console.error('Error: '+error);
          process.exit();
      }else{
        pubFunctions.createChangeNotification(resourceName, function(genChangeNotification){
            assert(genChangeNotification);
            genChangeNotification.content.title = "Data Access Enabled";
            pubFunctions.sendChangeNotifications(enabledToken, genChangeNotification, 3, [], function(error, results){
                if(error){
                    console.error(error);
                    process.exit();
                }else{
                    assert.equal(results.length, 3);
                    done();
                }
            });
        });
      }
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


 it("Send 3 Change Notifications with dataAccess Disable", function(done){
    pubFunctions.createChangeNotification(resourceName, function(genChangeNotification){
        assert(genChangeNotification);
        genChangeNotification.content.title = "Data Access Disabled";
        pubFunctions.sendChangeNotifications(accessToken, genChangeNotification, 3, [], function(error, results){
            if(error){
                console.error(error);
                process.exit();
            }else{
                console.error(results)
                assert.equal(results.length, 3);
                done();
            }
        });
    });
 });

 it("Verify all Messages are in Consume", function(done){
    mqsFunctions.callConsume(subAccessToken, 0, function(error, response){
       if(error){
           console.error(error);
           process.exit();
       }else{
            assert.equal(response.length, 6);
            done();
       }
   });
 });


 it("Verify all Messages are in ConsumeAll", function(done){
    this.timeout(1500000);
   authFunctions.convertConsumeAll(subAccessToken, function(error, consumeToken){
       if(error){
           console.error(error);
           process.exit();
       }else{
           mqsFunctions.callConsumeAll(consumeToken, lastConsumeAllId, function(error, response){
               if(error){
                   console.error(error);
                   process.exit();
               }else{
                    assert.equal(response.length, 3);
                    done();
               }
           });
       }
   });
 })
});
