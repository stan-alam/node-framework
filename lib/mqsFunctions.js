'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

function callConsumeAll(jwt, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('GET', envVars.test.url+"/consumeAll", {
                'headers': {
                    "content-type": envVars.headers.mqs,
                    "Authorization": "Bearer "+ jwt
                }
            });
            if(res.statusCode !== 200){
                log.error("MQS Failed to call ConsumeAll Endpoint");
                callback(res);
            }else{
                callback(null, JSON.parse(res.getBody('utf8')));
            }
        });
}

module.exports = exports = {
                callConsumeAll: callConsumeAll
                };