'use strict';

/**
* This is Functions used for making calls to hub-message-queue-service
*
* @class mqsFunctions
* @constructor
*/

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      sleep = require('system-sleep'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

/**
 * Call to MQS using Consume All
 * @async
 *
 * @method callConsumeAll
 * @param {string} JWT - Token to be used when making calls to config
 * @param {lastId} lastId - last process ID
 * @return {object} response from MQS body with status code
 */
function callConsumeAll(jwt, lastId, callback){
        let res = request('GET', envVars.url+"/consumeAll?lastProcessedID="+lastId, {
            'headers': {
                "Authorization": "Bearer "+ jwt
            }
        });
        console.log(res.statusCode);
        if(res.statusCode == 429){
            log.error("Rate limit Hit on ConsumeAll Sleep for 1 sec and retry");
            sleep(1000)
            callConsumeAll(jwt, lastId, callback);
        }else if(res.statusCode !== 200){
            log.error("MQS Failed to call ConsumeAll Endpoint Status: "+ res.statusCode);
            callback({ 'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode });
        }else{
            callback(null, { 'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode });
        }
}

/**
 * Call to MQS using Consume
 * @async
 *
 * @method callConsume
 * @param {string} JWT - Token to be used when making calls to config
 * @param {lastId} lastId - last process ID
 * @return {object} response from MQS including body and status code
 */
function callConsume(jwt, id, callback){
    let res = request('GET', envVars.url+"/consume?lastProcessedID="+id, {
        'headers': {
            "Authorization": "Bearer "+ jwt
        }
    });
    if(res.statusCode == 429){
        log.error("Rate limit Hit on Consume Sleep for 1 sec and retry");
        sleep(1000)
        callConsume(jwt, id, callback);
    }else if(res.statusCode !== 200){
        log.error("MQS Failed to call Consume Endpoint");
        callback(res);
    }else{
        callback(null,  { 'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode });
    }
}

module.exports = exports = {
                callConsumeAll: callConsumeAll,
                callConsume: callConsume
                };