'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      uuid = require('uuid'),
      randomstring = require("randomstring"),
      _ = require('lodash'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

function createApplications(count, jwt, responses, callback){
    if(count == (responses.length)){
        callback(null, responses);
    }else{
        authFunctions.openJwt(jwt, function(token){
            let applicationName = randomstring.generate({
                                                      length: 20,
                                                      charset: 'alphabetic'
                                                    });
            console.error(applicationName);
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
                createApplications(count, jwt, responses, callback);
            }
        });
    }
}

function deleteApplications(id, jwt){
    authFunctions.openJwt(jwt, function(token){
        let applicationName = randomstring.generate({
                                                  length: 20,
                                                  charset: 'alphabetic'
                                                });
        let applicationBody = {
            'id': uuid.v4(),
            'name': applicationName
        };
        let res = request('DELETE', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications/"+id, {
            'headers': {
                "content-type": envVars.headers.config,
                "Authorization": "Bearer "+ jwt
            }
        });
    });
}

function addPublishingResource(jwt, application, resourceName, callback){
    authFunctions.openJwt(jwt, function(token){
        let appId = application.id;
        application['resources'] = {
            "baseUri": "http://nodeTesting.com/",
            "resources": [{
                "name": resourceName
            }]
        };
        delete application['metadata'];

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
module.exports = exports = {
                createApplications: createApplications,
                deleteApplications: deleteApplications,
                addPublishingResource: addPublishingResource,
                addSubscribingResource: addSubscribingResource
                };