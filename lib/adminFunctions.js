'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

function allTenantsFlag(jwt, method, callback){
        authFunctions.openJwt(jwt, function(token){
            let res = request('POST', envVars.test.url+"/admin/privileges/"+token.tenant.id, {
                'headers': {
                    "Authorization": "Bearer "+ jwt
                },
                body: JSON.stringify({ "allTenants": (method.toLowerCase() == 'enable') })
            });
            if(res.statusCode !== 200){
                log.error("Failed to call Admin-api data access To "+method);
                callback(res);
            }else{
                callback(null, JSON.parse(res.getBody('utf8')));
            }
        });
}

module.exports = exports = {
                allTenantsFlag: allTenantsFlag
                };