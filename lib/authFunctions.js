'use strict';

const webdriver = require('selenium-webdriver'),
      By = require('selenium-webdriver').By,
      until = require('selenium-webdriver').until,
      jwt = require('jsonwebtoken'),
      request = require('sync-request'),
      log = require('./logger.js'),
      _ = require('lodash'),
      uuid = require('uuid'),
      envVars = require('../framework/environments');

var env = process.env.ENV || 'test',
    username = process.env.Username || 'test_aaf010@shsu.edu',
    password = process.env.Password || 'Demo99!?',
    uiPrivateKey = process.env.uiPrivateKey || 'test scales right up',
    apiPrivateKey = process.env.apiPrivateKey || 'test scales right up',
    okta_name = 'I - Hub Test',
    headless = process.env.browserHeadless || false;


//Pull token for UI
// driver - web driver to
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

//Opening a JWT
// jwtToken - Token to Open
function openJwt(jwtToken, callback){
    callback(jwt.verify(jwtToken, uiPrivateKey));
}

//close JWT
// token - information to be signed
function closeJwt(token, callback){
    callback(jwt.sign(token, uiPrivateKey));
}

//opening an API KEY
function openApiJwt(jwtToken, callback){
    callback(jwt.verify(jwtToken.toString(), apiPrivateKey));
}

//Closing an API KEY
function closeApiJwt(token, callback){
    callback(jwt.sign(token, apiPrivateKey));
}

//Calling Authentication to get an Access key
// ApiKey - guid pulled from config to be converted to an access key
function getAccessToken(ApiKey, callback){
    let url = envVars.test.url+envVars.global.tokenService;
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
            jwt.verify(returnJwt, apiPrivateKey);
            callback(null, returnJwt);
        }catch(e){
            callback(e);
        }
    }
}

//Convert a jwt to have Ethos in the name and close
function convertConsumeAll(jwt, callback){
    openApiJwt(jwt, function(contentsToken){
        contentsToken.tenant.name = 'Ethos '+ contentsToken.tenant.name;
        closeApiJwt(contentsToken, function(jwt){
            callback(false, jwt);
        });
    });
}

module.exports = exports = {
                        getUiToken: getUiToken,
                        openJwt: openJwt,
                        closeJwt: closeJwt,
                        openApiJwt: openApiJwt,
                        closeApiJwt: closeApiJwt,
                        getAccessToken: getAccessToken,
                        convertConsumeAll: convertConsumeAll
                        };