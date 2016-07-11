'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      changeNotification = require('../framework/changeNotification'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

function createChangeNotification(resourceName, callback){
        changeNotification.resource.name = resourceName;
        callback(changeNotification);
}

//function sendChangeNotifications(jwt, payloads, count, responses, callback){
//    if(count == (payloads.length)){
//        callback(null, responses);
//    }else{
//        authFunctions.openJwt(jwt, function(token){
//            let applicationBody = {
//                'id': uuid.v4(),
//                'name': applicationName
//            };
//            let res = request('POST', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications", {
//                'headers': {
//                    "content-type": envVars.headers.config,
//                    "Authorization": "Bearer "+ jwt
//                },
//                'body': JSON.stringify(applicationBody)
//            });
//            if(res.statusCode !== 200){
//                callback("Config Insert Application Failed");
//            }else{
//                responses[responses.length] = JSON.parse(res.getBody('utf8'));
//                createApplications(count, jwt, responses, callback);
//            }
//        });
//    }
//}

module.exports = exports = {
                createChangeNotification: createChangeNotification
                };