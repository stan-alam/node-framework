'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      sleep = require('sleep'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

// Call to Hit consumeAll Endpoint
function callConsumeAll(jwt, lastId, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('GET', envVars.test.url+"/consumeAll?lastProcessedID="+lastId, {
                'headers': {
                    "Authorization": "Bearer "+ jwt
                }
            });
            if(res.statusCode == 429){
                log.error("Rate limit Hit on ConsumeAll Sleep for 1 sec and retry");
                sleep.sleep(1)
                callConsumeAll(jwt, lastId, callback);
            }else if(res.statusCode !== 200){
                log.error("MQS Failed to call ConsumeAll Endpoint Status: "+ res.statusCode);
                callback(res);
            }else{
                callback(null, JSON.parse(res.getBody('utf8')));
            }
        });
}


//Call to Consume Messages from MQS /consume
function callConsume(jwt, id, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('GET', envVars.test.url+"/consume?lastProcessedID="+id, {
                'headers': {
                    "Authorization": "Bearer "+ jwt
                }
            });
            if(res.statusCode == 429){
                log.error("Rate limit Hit on Consume Sleep for 1 sec and retry");
                sleep.sleep(1)
                callConsume(jwt, id, callback);
            }else if(res.statusCode !== 200){
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