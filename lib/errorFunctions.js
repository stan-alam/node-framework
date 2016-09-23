'use strict';

/**
* This is Functions used for making calls to error-reporting-service
*
* @class errorFunctions
* @constructor
*/

const request = require('sync-request'),
      _ = require('lodash'),
      envVars = require('../framework/environments'); //Global Environment File

/**
 * Call to send an Error Message to service
 * @async
 *
 * @method sendErrorMessages
 * @param {String} jwt - Token to use when sending error Message
 * @param {Object} payload - The error Message Payload that is to be sent to error service
 * @param {integer} count - Number of requests to send to error service
 * @param {array} responses - Array of responses from error service
 * @return {Array} Array of responses for each request to error service
 */
function sendErrorMessages(jwt, payloads, count, responses, callback){
    if(count == (responses.length)){
        callback(null, responses);
    }else{
        let res = request('POST', envVars.url+envVars.global.error, {
            'headers': {
                "content-type": envVars.headers.error,
                "Authorization": "Bearer "+ jwt
            },
            'body': JSON.stringify(payloads)
        });
        if(res.statusCode !== 201){
            callback( { 'message': "Failed to send Error Message: "+res.statusCode } );
        }else{
            responses[responses.length] = {'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode };
            sendErrorMessages(jwt, payloads, count, responses, callback);
        }
    }
}

/**
 * Call to send an Error Message to service
 * @async
 *
 * @method sendErrorMessages
 * @param {String} jwt - Token to use when sending error Message
 * @param {Object} payload - The error Message Payload that is to be sent to error service
 * @param {integer} count - Number of requests to send to error service
 * @param {array} responses - Array of responses from error service
 * @return {Array} Array of responses for each request to error service
 */
function sendErrorMessagesBadMediaType(jwt, payloads, callback){
        let res = request('POST', envVars.url+envVars.global.error, {
            'headers': {
                "content-type": 'oiajdoij',
                "Authorization": "Bearer "+ jwt
            },
            'body': JSON.stringify(payloads)
        });
        callback(null, {'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode });
}

module.exports = exports = {
               sendErrorMessages: sendErrorMessages,
               sendErrorMessagesBadMediaType: sendErrorMessagesBadMediaType
                };