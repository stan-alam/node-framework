'use strict';

/**
* This is Functions used for administration calls for permissions
*
* @class adminFunctions
* @constructor
*/

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      _eval = require('eval'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

/**
 * Convert allTenant Permissions on a Tenant
 * @async
 *
 * @method allTenantsFlag
 * @param {string} jwt - Token to be used in API request
 * @param {string} permission - [enable/disable] value for tenant Flag
 * @return {Object} response from hub-admin-api
 */
function allTenantsFlag(jwt, permission, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('POST', envVars.test.url+"/admin/privileges/"+token.tenant.id, {
                'headers': {
                    "Authorization": "Bearer "+ jwt
                },
                body: JSON.stringify({ "allTenants": (permission.toLowerCase() == 'enable') })
            });
            if(res.statusCode !== 200){
                log.error("Failed to call Admin-api data access To "+method);
                callback(res);
            }else{
                callback(null, res);
            }
        });
}

/**
 * Convert sharedDataCheck append any shared If needed to Next Step
 * @async
 *
 * @method sharedDataCheck
 * @param {Object} options - Token to be used in API request
 * @return {Object} response modified options with shared data Information
 */
function sharedDataCheck(options, callback){
    if(options.sharedData){
        let steplocation = JSON.stringify(options.shared['step'+options.sharedData.sharelocation.step]);
        let stepvalue = options.sharedData.sharelocation.value;
        let resultValue = _eval('module.exports = function () { return '+ steplocation+stepvalue+'} ');
        options[options.sharedData.key] = resultValue();
        callback(options);
    }else{
        callback(options);
    }
}

module.exports = exports = {
                allTenantsFlag: allTenantsFlag,
                sharedDataCheck: sharedDataCheck
                };