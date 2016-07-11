'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

function callConsumeAll(jwt, lastId, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('GET', envVars.test.url+"/consumeAll?lastProcessedID="+lastId, {
                'headers': {
                    "Authorization": "Bearer "+ jwt
                }
            });
            if(res.statusCode !== 200){
                log.error("MQS Failed to call ConsumeAll Endpoint Status: "+ res.statusCode);
                callback(res);
            }else{
                callback(null, JSON.parse(res.getBody('utf8')));
            }
        });
}

function callConsume(jwt, id, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('GET', envVars.test.url+"/consume?lastProcessedID="+id, {
                'headers': {
                    "Authorization": "Bearer "+ jwt
                }
            });
            if(res.statusCode !== 200){
                log.error("MQS Failed to call Consume Endpoint");
                callback(res);
            }else{
                callback(null, JSON.parse(res.getBody('utf8')));
            }
        });
}

module.exports = exports = {
                callConsumeAll: callConsumeAll,
                callConsume: callConsume
                };