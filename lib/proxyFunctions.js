'use strict';

 const request = require('sync-request'),
      log = require('./logger.js'),
      envVars = require('../framework/environments'); //Global Environment File

function epaGetMany(jwt, resourceName, tenantid, callback){
  console.log("epagettingMany");
    let res = request("GET", envVars.url+"/proxy/"+tenantid+"/api/"+resourceName,{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
    });
    callback(res.statusCode);
}
function getMany(jwt,resource,callback){
  console.log("gettingMany");
  let res = request("GET", envVars.url+"/api/"+resource,{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
            });
            callback({body: res.body.toString('utf8'), statusCode: res.statusCode});
}
function getOne(jwt,id,callback){
  console.log("gettingOne");
  let res = request("GET", envVars.url+"/api/subjects/"+id,{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      }
            });
            callback({body: res.body.toString('utf8'), statusCode: res.statusCode});
}
function post(jwt,path,callback){
   console.log("posting");
    let res = request("POST", envVars.url+"/api/subjects"+path,{
           'headers': {
                         "Authorization": "Bearer "+ jwt
                      },
            'body': JSON.stringify({"resourceName": "proxyAutomationsubjects"})
    });
    callback(res.statusCode);
}

function postwithNoAuthorization(callback){
   console.log("posting with No Authorization");
    let res = request("POST", envVars.url+"/api/subjects",{
          'body': JSON.stringify({"resourceName": "proxyAutomationsubjects"})
    });
    callback(res.statusCode);
}

function put(jwt,id,contentType,callback){
 console.log("putting with contentType="+contentType);
  let res = request("PUT", envVars.url+"/api/subjects/"+id,{
             'headers': {
                           "Authorization": "Bearer "+ jwt,
                           "Content-Type": contentType 
                        },
                'body': JSON.stringify( {"module" : "proxy", "testcase" : "PRX-TC01", "method" : "put"})
              });
               callback({body: res.body.toString('utf8'), statusCode: res.statusCode});
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


module.exports = exports = {
    epaGetMany: epaGetMany,
    post:post,
    getMany:getMany,
    put:put,
    deleteResource:deleteResource,
    getOne:getOne,
    postwithNoAuthorization:postwithNoAuthorization
}
