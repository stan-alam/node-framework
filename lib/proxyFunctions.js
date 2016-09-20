'use strict';

 const request = require('sync-request'),
      log = require('./logger.js');

function GetMany(jwt,resourceName,callback){
         let res = request('GET', envVars.test.url+"/api/"+resourceName, {
                 'headers': {
                         "Authorization": "Bearer "+ jwt
                        }
                   });
                   if(res.statusCode !== 200)
                        callback("GetMany Request Failed",null);
                   else
                        callback(null, JSON.parse(res.getBody('utf8')));
}