'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      uuid = require('uuid'),
      randomstring = require("randomstring"),
      _ = require('lodash'),
      envVars = require('../framework/environments'); //Global Environment File

var env = process.env.ENV || 'test';

/*
 // Creating applications
 - count: the number of applications to be created
 - jwt:  Token to use when hitting publisher
 - listAppNames: Array of Application Names
 - responses: blank array of already created applications
*/
function createApplications(count, jwt, listAppNames, responses, callback){
    if(count == (responses.length)){
        callback(null, responses);
    }else{
        authFunctions.openJwt(jwt, function(token){
            let applicationName = listAppNames[responses.length] || randomstring.generate({
                                                      length: 20,
                                                      charset: 'alphabetic'
                                                    });

            let applicationBody = {
                'id': uuid.v4(),
                'name': applicationName
            };
            let res = request('POST', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications", {
                'headers': {
                    "content-type": envVars.headers.config,
                    "Authorization": "Bearer "+ jwt
                },
                'body': JSON.stringify(applicationBody)
            });
            if(res.statusCode !== 200){
                callback("Config Insert Application Failed");
            }else{
                responses[responses.length] = JSON.parse(res.getBody('utf8'));
                createApplications(count, jwt, listAppNames, responses, callback);
            }
        });
    }
}

/*
 // Delete Applications for config
 - id: Id of Applications to be Deleted
 - jwt: Token to be used when Hitting Config to delete Applications
*/
function deleteApplications(id, jwt, callback){
    authFunctions.openJwt(jwt, function(token){
        let res = request('DELETE', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications/"+id, {
            'headers': {
                "content-type": envVars.headers.config,
                "Authorization": "Bearer "+ jwt
            }
        });
        callback(true);
    });
}

/*
 // Add a Resource to an application for becoming a publisher
 - jwt: token to use when hitting config
 - application: Object of the Application to add Resource Too
 - resourceName: name of the resource to subscribe to, can be an array
*/
function addPublishingResource(jwt, application, resourceName, callback){
    authFunctions.openJwt(jwt, function(token){
        let appId = application.id;
        application['resources'] = {
            "baseUri": "http://nodeTesting.com/",
            "resources": []
        };
        delete application['metadata'];

        if ((typeof resourceName) !== 'string') {
            _.each (resourceName, function(resource) {
                application['resources'].resources.push({'name' : resource});
            });
        } else {
            application['resources'].resources = [{'name' : resourceName}];
        }

        let res = request('PUT', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications/"+appId, {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    },
                    "body": JSON.stringify(application)
                });
        if(res.statusCode !== 200){
            callback("Config adding Pub Application Resource Failed");
        }else{
            callback(null, JSON.parse(res.getBody('utf8')));
    }
    });
}

/*
// Turn an application to a subscribing app
- jwt: token to use when hitting configuration
- application: Application Object to modify
- resourceName: name of the resource to subscribe too
*/
function addSubscribingResource(jwt, application, resourceName, callback){
    authFunctions.openJwt(jwt, function(token){
        let appId = application.id;
        application['subscriptions'] = [ { "resourceName": resourceName } ];
        delete application['metadata'];

        let res = request('PUT', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications/"+appId, {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    },
                    "body": JSON.stringify(application)
                });

        if(res.statusCode !== 200){
            callback("Config adding Sub Application Resource Failed");
        }else{
            callback(null, JSON.parse(res.getBody('utf8')));
        }
    });
}

/*
// Pull latest config information
- jwt: token to use for hitting configuration
*/
function getConfiguration(jwt, callback){
    authFunctions.openJwt(jwt, function(token){
        let res = request('GET', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications", {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    }
                });

        if(res.statusCode !== 200){
            callback("Config reading Applications Failed");
        }else{
            callback(null, JSON.parse(res.getBody('utf8')));
        }
    });
}

module.exports = exports = {
                createApplications: createApplications,
                deleteApplications: deleteApplications,
                addPublishingResource: addPublishingResource,
                addSubscribingResource: addSubscribingResource,
                getConfiguration: getConfiguration
                };
