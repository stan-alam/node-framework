'use strict';

/**
* This is Functions used for making calls to hub-publish-api
*
* @class pubFunctions
* @constructor
*/

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      uuid = require('uuid'),
      changeNotification = require('../framework/changeNotification'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

/**
 * Call to create a change notification using default framework
 * @async
 *
 * @method createChangeNotification
 * @param {String} resourceName - Resource the Change notification will be attached too
 * @return {Object} Generated Change Notification
 */
function createChangeNotification(resourceName, callback){
        changeNotification.resource.name = resourceName;
        callback(changeNotification);
}

/**
 * Call to create a send change notification to Publisher
 * @async
 *
 * @method sendChangeNotifications
 * @param {String} jwt - Token to use when sending change notification to publisher
 * @param {Object} payload - The change notification that is to be sent to publisher
 * @param {integer} count - Number of requests to send to publisher
 * @param {array} responses - Array of responses from publisher
 * @return {Array} Array of responses for each request to publisher
 */
function sendChangeNotifications(jwt, payloads, count, responses, callback){
    if(count == (responses.length)){
        callback(null, responses);
    }else{
        let res = request('POST', envVars.url+envVars.global.publisher, {
            'headers': {
                "content-type": envVars.headers.publisher,
                "Authorization": "Bearer "+ jwt
            },
            'body': JSON.stringify(payloads)
        });

        //TODO: Console log a 0....5....10....15 , etc
        //TODO: Look into handling this error, with Driver
//        if(res.statusCode !== 200){
            //callback("Failed to Insert change Notification: "+res.statusCode);
//        }else{
            responses[responses.length] = JSON.parse(res.getBody('utf8'));
            sendChangeNotifications(jwt, payloads, count, responses, callback);
//        }
    }
}

module.exports = exports = {
                createChangeNotification: createChangeNotification,
                sendChangeNotifications: sendChangeNotifications
                };