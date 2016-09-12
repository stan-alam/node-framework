'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      uuid = require('uuid'),
      changeNotification = require('../framework/changeNotification'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

//Call to generate a change notification
// resourceName - name of resource to be used for for change notification
function createChangeNotification(resourceName, callback){
        changeNotification.resource.name = resourceName;
        callback(changeNotification);
}

//Send Change notification to publisher
// jwt - token to be used when hitting publisher
// payload - Change Notification to send to publisher
// count - Number of messages to push to publisher
// responses - array for responses for each request to publisher
function sendChangeNotifications(jwt, payloads, count, responses, callback){
    if(count == (responses.length)){
        callback(null, responses);
    }else{
        authFunctions.openJwt(jwt, function(token){
            let res = request('POST', envVars.test.url+envVars.global.publisher, {
                'headers': {
                    "content-type": envVars.headers.publisher,
                    "Authorization": "Bearer "+ jwt
                },
                'body': JSON.stringify(payloads)
            });
            if(res.statusCode !== 200){
                callback("Failed to Insert change Notification: "+res.statusCode);
            }else{
                responses[responses.length] = JSON.parse(res.getBody('utf8'));
                sendChangeNotifications(jwt, payloads, count, responses, callback);
            }
        });
    }
}

module.exports = exports = {
                createChangeNotification: createChangeNotification,
                sendChangeNotifications: sendChangeNotifications
                };