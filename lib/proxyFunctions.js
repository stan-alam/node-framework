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
function post(jwt,callback){
   console.log("posting");
    let res = request("POST", envVars.url+"/api/subjects",{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      },
            'body': JSON.stringify({"resourceName": "proxyAutomationsubjects"})
    });
   console.log(JSON.stringify(res));
    callback(res.statusCode);
}
function postwithExtendedURLPath(jwt,callback){
     let res = request("POST", envVars.url+"/api/subjects/1cbfa479-ad94-4b38-8e6e-24ec367078b3/apple",{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      },
            'body': JSON.stringify({"resourceName": "proxyAutomationsubjects"})
    });
    callback(res.statusCode);
}
function getMany(jwt,callback){
  let res = request("GET", envVars.url+"/api/subjects",{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
            });
            callback(res.statusCode);
}
function put(jwt,id,callback){
  let res = request("PUT", envVars.url+"/api/subjects/"+id,{
             'headers': {
                           "Authorization": "Bearer "+ jwt,
                           "Content-Type":"application/vnd.hedtech.applications.v2+json"
                        },
                'body': JSON.stringify( {"module" : "proxy", "testcase" : "PRX-TC01", "method" : "put"})          
              });
              callback(res.statusCode);
}
function deleteResource(jwt,id,callback){
 let res = request("DELETE", envVars.url+"/api/subjects/"+id,{
             'headers': {
                           "Authorization": "Bearer "+ jwt
                        }
              });
              callback(res.statusCode);
}
module.exports = exports = {
    epaGetMany: epaGetMany,
    post:post,
    getMany:getMany,
    put:put,
    deleteResource:deleteResource,
    postwithExtendedURLPath:postwithExtendedURLPath
}