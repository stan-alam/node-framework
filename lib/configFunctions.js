'use strict';

/**
* This is Functions used for making calls to hub-configuration-api
*
* @class configFunctions
* @constructor
*/

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      uuid = require('uuid'),
      randomstring = require("randomstring"),
      _ = require('lodash'),
      epaConfig = require('../framework/epaConfiguration'),
      envVars = require('../framework/environments'); //Global Environment File

var env = process.env.ENV || 'test';

/**
 * Call to create a number of applications
 * @async
 *
 * @method createApplications
 * @param {integer} count - Number of applications you are looking to create
 * @param {string} JWT - Token to be used when making calls to config
 * @param {array} listAppNames - Empty Array or an Array of string as application names
 * @param {array} responses - Always an Empty array
 * @return {array} Array of Objects for each response body and statusCode
 */
function createApplications(count, jwt, listAppNames, responses, callback){
    if(count == (responses.length)){
        console.log("createApplications responses="+JSON.stringify(responses));
        callback(null, responses);
    }else{
        authFunctions.openJwt(jwt, function(error,token){
            if(!error){
                let applicationName = listAppNames[responses.length] || randomstring.generate({
                                                          length: 20,
                                                          charset: 'alphabetic'
                                                        });

                let applicationBody = {
                    'id': uuid.v4(),
                    'name': applicationName
                };
                let res = request('POST', envVars.url+"/admin/"+token.tenant.alias+"/api/applications", {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    },
                    'body': JSON.stringify(applicationBody)
                });
                if(res.statusCode !== 200){
                    callback({"msg": "Config Insert Application Failed", "payload": applicationBody, "status": res.statusCode });
                }else{
                    responses[responses.length] = {
                        'body': JSON.parse(res.getBody('utf8')),
                        'statusCode': res.statusCode
                    }
                    createApplications(count, jwt, listAppNames, responses, callback);
                }
            }
            else
            {
                 callback({"msg": "Config Insert Application Failed.Cannot get tenant alias from token due to error" + error });
            }
        });
    }
}

/**
 * Call to delete one application
 * @async
 *
 * @method deleteApplications
 * @param {guid} id - Application ID to be deleted
 * @param {string} JWT - Token to be used when making calls to config
 * @return {object} Objects containing statusCode
 */
function deleteApplications(id, jwt, callback){
    authFunctions.openJwt(jwt, function(error,token){
        let res = request('DELETE', envVars.url+"/admin/"+token.tenant.alias+"/api/applications/"+id, {
            'headers': {
                "content-type": envVars.headers.config,
                "Authorization": "Bearer "+ jwt
            }
        });
        callback({ 'statusCode': res.statusCode });
    });
}

/**
 * Modify an application to make authoritative for a resource
 * @async
 *
 * @method addPublishingResource
 * @param {string} JWT - Token to be used when making calls to config
 * @param {Object} application - whole object of the application to assign a resource too
 * @param {string/array} resourceName - resource name as a string or an array of resource names
 * @return {array} Array of Objects for each response body and statusCode
 */
function addPublishingResource(jwt, application, resourceName, callback){
    authFunctions.openJwt(jwt, function(error,token){
        let appId = application.id;
        application['resources'] = {
            "baseUri": "http://hub-authoritative-source-example.2020ar.com:443/ihub1/api",
            "resources": []
        };
        delete application['metadata'];

        if ((typeof resourceName) !== 'string') {
            _.each (resourceName, function(resource) {
                application['resources'].resources.push({'name' : resource});
            });
        } else {
            application['resources'].resources = [{'name' : resourceName}];
        }

        let res = request('PUT', envVars.url+"/admin/"+token.tenant.alias+"/api/applications/"+appId, {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    },
                    "body": JSON.stringify(application)
                });
        if(res.statusCode !== 200){
            callback({ "msg": "Config adding Pub Application Resource Failed", "statusCode": res.statusCode });
        }else{
            callback(null, { 'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode });
    }
    });
}

/**
 * Call to add Subscriptions to an application
 * @async
 *
 * @method addSubscribingResources
 * @param {string} JWT - Token to be used when making calls to config
 * @param {object} application - Application Object to add Resource as subscription
 * @param {string/array} resourceName - Resource name or array of resource names
 * @return {array} Array of Objects for each response body and statusCode
 */
function addSubscribingResource(jwt, application, resourceName, callback){
    authFunctions.openJwt(jwt, function(error,token){
        let appId = application.id;
        application['subscriptions'] = [];
        delete application['metadata'];

        if ((typeof resourceName) === 'string') {
            application['subscriptions'] = [ { "resourceName": resourceName } ];
        } else {
            _.each(resourceName, function(resource) {
                application['subscriptions'].push({ "resourceName": resource } );
            });
        }

        let res = request('PUT', envVars.url+"/admin/"+token.tenant.alias+"/api/applications/"+appId, {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    },
                    "body": JSON.stringify(application)
                });

        if(res.statusCode !== 200){
            callback({ 'msg': "Config adding Sub Application Resource Failed", 'statusCode': res.statusCode });
        }else{
            callback(null, {'body': JSON.parse(res.getBody('utf8')), 'statusCode': res.statusCode });
        }
    });
}

/**
 * Call to get array of objects for each Configuration
 * @async
 *
 * @method getConfiguration
 * @param {string} JWT - Token to be used when making calls to config
 * @return {array} Array of applications from configuration
 */
function getConfiguration(jwt, callback){
    authFunctions.openJwt(jwt, function(error,token){
        let res = request('GET', envVars.url+"/admin/"+token.tenant.alias+"/api/applications", {
                    'headers': {
                        "content-type": envVars.headers.config,
                        "Authorization": "Bearer "+ jwt
                    }
                });

        if(res.statusCode !== 200){
            callback({ 'msg': "Config reading Applications Failed", "statusCode": res.statusCode });
        }else{
            callback(null, JSON.parse(res.getBody('utf8')));
        }
    });
}

/**
* Call to Add Credentials for EPA's
* @async
*
* @method addCredentials
* @param {guid} appId - Application ID to add credentials too
* @param {string} username - Username for Credentials
* @param {string} password - Password for Credentials
* @param {string} title - Title for Credentials
* @param {string} jwt - Bearer Token for making call
* @return result statuscode and body from configuration
*/
function addEPACredentials(appId, username, password, title, jwt, callback){
     authFunctions.openJwt(jwt, function(error,token){
        epaConfig.title = title,
        epaConfig.credentials[0].application.id = appId;
        epaConfig.credentials[0].username = username;
        epaConfig.credentials[0].password = password;

        let res = request('POST', envVars.url+"/admin/"+token.tenant.alias+"/api/privileged-app-credentials", {
            'headers': {
                "content-type": envVars.headers.privilegedappcredentials,
                "Authorization": "Bearer "+ jwt
            },
            'body': JSON.stringify(epaConfig)
        });
        if(res.statusCode !== 201){
            callback({ body: res.getBody('utf8'), statusCode: res.statusCode});
        }else{
              callback(null,{ body: res.getBody('utf8'), statusCode: res.statusCode} );
        }
     });
}

module.exports = exports = {
                createApplications: createApplications,
                deleteApplications: deleteApplications,
                addPublishingResource: addPublishingResource,
                addSubscribingResource: addSubscribingResource,
                getConfiguration: getConfiguration,
                addEPACredentials:addEPACredentials
                };
