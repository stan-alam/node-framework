'use strict';

/**
* This is Function that setups a working environment for users to start using used for making calls to a already setup config
*
* @class preSetup
* @constructor
*/

const authFunctions = require('./authFunctions.js'),
      uiFunctions = require('./uiFunctions.js'),
      configFunctions = require('./configFunctions.js'),
      request = require('sync-request'),
      _ = require('lodash'),
      epaConfig = require('../framework/epaConfiguration'),
      configController = require('../test/hub-configuration-api/controller'),
      envVars = require('../framework/environments'),
      randomstring = require("randomstring"),
      integration = require('../framework/integration'),
      integrationTemplate = require('../framework/integration-template');



/**
* deleteAll This is for removing all applications on start
* @async
*
* @method setup
* @param {Object} driver - selenium driver
* @return {Object} driver - selenium driver
*/
function deleteAll(driver, callback){
    authFunctions.getUiToken(driver, function(Token){
        configFunctions.getConfiguration(Token, function(error, configuration){
            if(configuration.length == 0)
                callback(driver)
            _.each(configuration, function(app){
                if(app.id == false)
                    callback(driver)
                configFunctions.deleteApplications(app.id, Token, function(status, error){
                });
            });
        });
    });
}

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

module.exports = exports = {
             setup: setup,
             cleanUp: cleanUp,
             deleteAll: deleteAll
             };