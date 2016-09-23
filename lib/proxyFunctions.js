'use strict';

 const request = require('sync-request'),
      log = require('./logger.js'),
      envVars = require('../framework/environments'); //Global Environment File

function epaGetMany(jwt, resourceName, tenantid, callback){
    let res = request("GET", envVars.url+"/proxy/"+tenantid+"/api/"+resourceName,{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
            });
            callback(res.statusCode);
}

module.exports = exports = {
    epaGetMany: epaGetMany
}