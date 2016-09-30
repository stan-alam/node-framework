'use strict';

/**
 * This is Functions used for making calls to error-reporting-service
 *
 * @class errorFunctions
 * @constructor
 */

const request = require('sync-request'),
    _ = require('lodash'),
    authFunctions = require('./authFunctions.js'),
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
function sendErrorMessages(jwt, payloads, count, responses, callback) {
    if (count == (responses.length)) {
        callback(null, responses);
    } else {
        let res = request('POST', envVars.url + envVars.global.error, {
            'headers': {
                "content-type": envVars.headers.error,
                "Authorization": "Bearer " + jwt
            },
            'body': JSON.stringify(payloads)
        });
        if (res.statusCode !== 201) {
            callback({
                'body': res.body.toString(),
                'statusCode': res.statusCode
            });
        } else {
            responses[responses.length] = {
                'body': JSON.parse(res.getBody('utf8')),
                'statusCode': res.statusCode
            };
            sendErrorMessages(jwt, payloads, count, responses, callback);
        }
    }
}

/**
 * Call to send an Send bad media type to any endpoint
 * @async
 *
 * @method sendMessageBadMediaType
 * @param {String} jwt - Token to use when sending
 * @param {String} endpoint - Which endpoint to make call too
 * @param {Object} payload - The error Message Payload that is to be sent to error service
 * @return {Array} Array of responses for each request to error service
 */
function sendMessageBadMediaType(jwt, endpoint, payload, callback) {
    if (!envVars.global[endpoint]) {
        callback({
            'msg': 'Endpoint ' + endpoint + ' is not valid'
        })
    } else {
        let res = request('POST', envVars.url + envVars.global[endpoint], {
            'headers': {
                "content-type": 'application/json',
                "Authorization": "Bearer " + jwt
            },
            'body': JSON.stringify(payload)
        });
        if (res.statusCode !== 415) {
            callback({
                'body': '',
                'statusCode': res.statusCode
            });
        } else {
            callback(null, {
                'body': '',
                'statusCode': res.statusCode
            });
        }
    }
}

/**
 * Call to send an Send an expired token to any endpoint
 * @async
 *
 * @method sendMessageExpiredToken
 * @param {String} jwt - Token to use when sending
 * @param {String} endpoint - Which endpoint to make call too
 * @param {Object} payload - The error Message Payload that is to be sent to error service
 * @return {Array} Array of responses for each request to error service
 */
function sendMessageExpiredToken(jwt, endpoint, payload, callback) {
    if (!envVars.global[endpoint]) {
        callback({
            'msg': 'Endpoint ' + endpoint + ' is not valid'
        })
    } else {
        authFunctions.expireToken(jwt, function(error, jwt) {
            let res = request('POST', envVars.url + envVars.global[endpoint], {
                'headers': {
                    "content-type": 'application/json',
                    "Authorization": "Bearer " + jwt
                },
                'body': JSON.stringify(payload)
            });
            if (res.statusCode !== 401) {
                callback({
                    'body': '',
                    'statusCode': res.statusCode
                });
            } else {
                callback(null, {
                    'body': '',
                    'statusCode': res.statusCode
                });
            }
        });
    }
}

/**
 * Call to send an payload to false endpoint
 * @async
 *
 * @method sendMessageBadEndpoint
 * @param {String} jwt - Token to use when sending
 * @param {String} endpoint - Which endpoint to make call too
 * @return {Array} Array of responses for each request to error service
 */
function sendMessageBadEndpoint(jwt, endpoint, callback) {
    let res = request('GET', envVars.url + endpoint, {
        'headers': {
            "content-type": 'application/json',
            "Authorization": "Bearer " + jwt
        },
    });
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ this is the bad end point GET " + envVars.url + endpoint);
    if (res.statusCode !== 400) {
        callback({
            'body': '',
            'statusCode': res.statusCode
        });
    } else {
        callback(null, {
            'body': '',
            'statusCode': res.statusCode
        });
    }
}

function sendMessageBadEndpointPost(jwt, endpoint, callback) {
    let res = request('POST', envVars.url + endpoint, {
        'headers': {
            "content-type": envVars.headers.config,
            "Authorization": "Bearer " + jwt
        },
        'body': '{"allTenants" : false}'
    });
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ this is the bad end point POST " + envVars.url + endpoint);
    console.log(" THIS IS THE BODY RETURN FROM PRIV" + JSON.stringify(res));
    console.log("THIS IS THE TOKEN THAT IS BEING POSTED" + jwt);
    if (res.statusCode !== 400) {
        callback({
            'body': '',
            'statusCode': res.statusCode
        });
    } else {
        callback(null, {
            'body': '',
            'statusCode': res.statusCode
        });
    }
}

//sendPermissionsInvalidPayload

function sendPermissionsInvalidPayload(jwt, endpoint, callback) {
    let res = request('POST', envVars.url + endpoint, {
        'headers': {
            "content-type": envVars.headers.config,
            "Authorization": "Bearer " + jwt
        },
        'body': '{"alltenants" : true}'
    });
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ this is the invalid Payload POST " + envVars.url + endpoint);
    console.log(" THIS IS THE BODY RETURN FROM Post invalid payload" + JSON.stringify(res));
    console.log("THIS IS THE TOKEN THAT IS BEING POSTED" + jwt);
    if (res.statusCode !== 400) {
        callback({
            'body': '',
            'statusCode': res.statusCode
        });
    } else {
        callback(null, {
            'body': '',
            'statusCode': res.statusCode
        });
    }
}



function sendPermissionsNoPayload(jwt, endpoint, callback) {
    let res = request('POST', envVars.url + endpoint, {
        'headers': {
            "content-type": envVars.headers.config,
            "Authorization": "Bearer " + jwt
        },
        'body': ''
    });
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ this is the NO Payload POST " + envVars.url + endpoint);
    console.log(" THIS IS THE BODY RETURN FROM Post NO payload" + JSON.stringify(res));
    console.log("THIS IS THE TOKEN THAT IS BEING POSTED" + jwt);
    if (res.statusCode !== 400) {
        callback({
            'body': '',
            'statusCode': res.statusCode
        });
    } else {
        callback(null, {
            'body': '',
            'statusCode': res.statusCode
        });
    }
}







module.exports = exports = {
    sendErrorMessages: sendErrorMessages,
    sendMessageBadMediaType: sendMessageBadMediaType,
    sendMessageExpiredToken: sendMessageExpiredToken,
    sendMessageBadEndpoint: sendMessageBadEndpoint,
    sendMessageBadEndpointPost: sendMessageBadEndpointPost,
    sendPermissionsInvalidPayload: sendPermissionsInvalidPayload
};