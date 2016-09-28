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
  console.log("gettingMany");
  let res = request("GET", envVars.url+"/api/subjects",{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
            });
            callback({body: res.getBody('utf8'), statusCode: res.statusCode});
}
function put(jwt,id,callback){
 console.log("putting");
  let res = request("PUT", envVars.url+"/api/subjects/"+id,{
             'headers': {
                           "Authorization": "Bearer "+ jwt,
                           "Content-Type":"application/vnd.hedtech.applications.v2+json"
                        },
                'body': JSON.stringify( {"module" : "proxy", "testcase" : "PRX-TC01", "method" : "put"})          
              });
               callback({body: res.getBody('utf8'), statusCode: res.statusCode});
}
function deleteResource(jwt,id,callback){
 console.log("deleting");
 let res = request("DELETE", envVars.url+"/api/subjects/"+id,{
             'headers': {
                           "Authorization": "Bearer "+ jwt
                        }
              });
              callback(res.statusCode);
}
function getOne(jwt,id,callback){
  console.log("gettingOne");
  let res = request("GET", envVars.url+"/api/subjects/"+id,{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
            });
            callback({body: res.getBody('utf8'), statusCode: res.statusCode});
}
module.exports = exports = {
    epaGetMany: epaGetMany,
    post:post,
    getMany:getMany,
    put:put,
    deleteResource:deleteResource,
    postwithExtendedURLPath:postwithExtendedURLPath,
    getOne:getOne
}