'use strict';

/**
* This is Function that setups a working environment for users to start using used for making calls to a already setup config
*
* @class preSetup
* @constructor
*/

const authFunctions = require('./authFunctions.js'),
      uiFunctions = require('./uiFunctions.js'),
      request = require('sync-request'),
      _ = require('lodash'),
      epaConfig = require('../framework/epaConfiguration'),
      configController = require('../test/hub-configuration-api/controller'),
      envVars = require('../framework/environments'),
      randomstring = require("randomstring"),
      integration = require('../framework/integration'),
      integrationTemplate = require('../framework/integration-template');

/**
* setup this is for setting up a default environment for running tests on
* @async
*
* @method setup
* @param {Object} driver - selenium driver
* @return {Object} driver - selenium driver
*/
function setup(driver, callback){
    authFunctions.getUiToken(driver, function(jwt){
        authFunctions.openJwt(jwt, function(error,token){
            integrationTemplate.application1.name = integrationTemplate.application1.name + '_' + randomstring.generate({
                                                                                                            length: 5,
                                                                                                            charset: 'alphabetic'
                                                                                                          });

            integrationTemplate.application2.name = integrationTemplate.application2.name + '_' + randomstring.generate({
                                                                                                            length: 5,
                                                                                                            charset: 'alphabetic'
                                                                                                          });
            let res = request('POST', envVars.url+'/admin/'+token.tenant.alias+'/api/integration-templates', {
                            'headers': {
                                "content-type": envVars.headers.integrationTemplates,
                                "Authorization": "Bearer "+ jwt
                            },
                            'body': JSON.stringify(integrationTemplate)
                        });
            let integrationTemplateRes = res.getBody('utf-8');
            integration.template.id = JSON.parse(integrationTemplateRes).id;

             res = request('POST', envVars.url+'/admin/'+token.tenant.alias+'/api/integrations', {
                            'headers': {
                                "content-type": envVars.headers.integration,
                                "Authorization": "Bearer "+ jwt
                            },
                            'body': JSON.stringify(integration)
                        });
             let integrationRes = res.getBody('utf-8');
             callback(driver, { 'integrationTemplate': JSON.parse(integrationTemplateRes), 'integration': JSON.parse(integrationRes) });
        });
    });
}

/**
* clean Up just to remove everything added by setup
* @async
*
* @method cleanUp
* @param {Object} driver - selenium driver
* @param {Object} setupData - Data used for removing
* @return {Object} driver - selenium driver
*/
function cleanUp(driver, setupData, callback){
    if(envVars.credentials.username == 'mbmormann'){
        configController.controller(driver, { 'actions': 'deleteApplications' }, function(){
            callback();
        });
    }else{
        authFunctions.getUiToken(driver, function(jwt){
            authFunctions.openJwt(jwt, function(error,token){
                let intTemp = request('DELETE', envVars.url+'/admin/'+token.tenant.alias+'/api/integration-templates/'+setupData.integrationTemplate.id, {
                    'headers': {
                        "content-type": envVars.headers.integration,
                        "Authorization": "Bearer "+ jwt
                    }});
                let recRemove = request('DELETE', envVars.url+'/admin/'+token.tenant.alias+'/api/applications/'+setupData.integration.record1.id, {
                    'headers': {
                        "content-type": envVars.headers.integration,
                        "Authorization": "Bearer "+ jwt
                    }});
                request('DELETE', envVars.url+'/admin/'+token.tenant.alias+'/api/applications/'+setupData.integration.record2.id, {
                    'headers': {
                        "content-type": envVars.headers.integration,
                        "Authorization": "Bearer "+ jwt
                    }});
                //driver.quit();
                callback();
            });
        });
    }
}

module.exports = exports = {
             setup: setup,
             cleanUp: cleanUp
             };