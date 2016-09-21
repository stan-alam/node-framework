'use strict';

/**
* This is Functions used for authentication and token manipulations
*
* @class authFunctions
* @constructor
*/

const webdriver = require('selenium-webdriver'),
      By = require('selenium-webdriver').By,
      until = require('selenium-webdriver').until,
      jwt = require('jsonwebtoken'),
      request = require('sync-request'),
      log = require('./logger.js'),
      _ = require('lodash'),
      uuid = require('uuid'),
      envVars = require('../framework/environments');

require('dotenv').load();

const privateKey = process.env.privateKey || 'test scales right up';

/**
 * Pull the UI JWT from browser cookie.
 * @async
 *
 * @method getUiToken
 * @param {string} driver - Selenium driver
 * @return {string} JWT - value of UI authentication token
 */
function getUiToken(driver, callback){
  return driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[1]/header/h1/a')), 10000).then(function(){
    return driver.manage().getCookies().then(function(cookies){
      callback(cookies[0].value);
    });
  }).catch(function(e){
   driver.takeScreenshot().then(
           function(image, err) {
               require('fs').writeFile('out.png', image, 'base64');
           }
       );
   });
}

/**
* Open JWT and get the contents of the token.
* @async
*
* @method openJWT
* @param {String} jwtToken - Encrypted JWT
* @return {Object} Returns - Contents of JWT
*/
function openJwt(jwtToken, callback){
    callback(jwt.verify(jwtToken, privateKey));
}

/**
* Close JWT Convert an Object to a Signed JWT for API Calls
* @async
*
* @method closeJWT
* @param {Object} token - Contents of JWT
* @return {String} Returns - Encrypted and signed JWT
*/
function closeJwt(token, callback){
    callback(jwt.sign(token, privateKey));
}

/**
* Call to convert an application apikey to an Access Token
* @async
*
* @method getAccessToken
* @param {Guid} ApiKey - Application ApiKey from application configuration
* @return {String} Returns Encrypted and signed JWT from auth service
*/
function getAccessToken(ApiKey, callback){
    let url = envVars.url+envVars.global.tokenService;
    let res = request('POST', url, {
        'headers': {
            "Authorization": "Bearer " + ApiKey
        }
    });
    if(res.statusCode != 200){
        callback('Invalid status Code Response from Token-Service: { url: ' + url + ',  apikey: ' + ApiKey + ' ) '+ res.statusCode);
    }else{
        try{
            let returnJwt = res.getBody().toString();
            jwt.verify(returnJwt, privateKey);
            callback(null, returnJwt);
        }catch(e){
            callback(e);
        }
    }
}

/**
* Modify JWT to add Ethos to Tenant Name
* @async
*
* @method convertConsumeAll
* @param {String} jwt - Contents of JWT
* @return {String} Encrypted and signed JWT with Tenant name having Ethos Prepended
*/
function convertConsumeAll(jwt, callback){
    openJwt(jwt, function(contentsToken){
        contentsToken.tenant.name = 'Ethos '+ contentsToken.tenant.name;
        closeJwt(contentsToken, function(jwt){
            callback(false, jwt);
        });
    });
}

module.exports = exports = {
                        getUiToken: getUiToken,
                        openJwt: openJwt,
                        closeJwt: closeJwt,
                        getAccessToken: getAccessToken,
                        convertConsumeAll: convertConsumeAll
                        };