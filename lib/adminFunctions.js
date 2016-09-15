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

module.exports = exports = {
                allTenantsFlag: allTenantsFlag
                };