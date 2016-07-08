'use strict';

const authFunctions = require('./authFunctions.js'),
      request = require('sync-request'),
      log = require('./logger.js'),
      uuid = require('uuid'),
      randomstring = require("randomstring"),
      _ = require('lodash'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test';

function createApplications(count, jwt, callback){
    authFunctions.openJwt(jwt, function(token){
        let applicationName = randomstring.generate({
                                                  length: 20,
                                                  charset: 'alphabetic'
                                                });
        let applicationBody = {
            'id': uuid.v4(),
            'name': applicationName
        };
        let res = request('POST', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications", {
            'headers': {
                "content-type": envVars.headers.config,
                "Authorization": "Bearer "+ jwt
            },
            'body': JSON.stringify(applicationBody)
        });
        if(res.statusCode !== 200){
            callback("Config Insert Application Failed");
        }else{
            let response = JSON.parse(res.getBody('utf8'));
            callback(null, response);
        }
    });
}

function deleteApplications(id, jwt){
    authFunctions.openJwt(jwt, function(token){
        let applicationName = randomstring.generate({
                                                  length: 20,
                                                  charset: 'alphabetic'
                                                });
        let applicationBody = {
            'id': uuid.v4(),
            'name': applicationName
        };
        let res = request('DELETE', envVars.test.url+"/admin/"+token.tenant.alias+"/api/applications/"+id, {
            'headers': {
                "content-type": envVars.headers.config,
                "Authorization": "Bearer "+ jwt
            }
        });
    });
}

module.exports = exports = {
                createApplications: createApplications,
                deleteApplications: deleteApplications
                };