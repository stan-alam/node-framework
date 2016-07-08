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

function getUiToken(driver, callback){
  return driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[1]/header/h1/a')), 10000).then(function(){
    return driver.manage().getCookies().then(function(cookies){
      console.error(cookies)
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

function openJwt(jwtToken, callback){
    callback(jwt.verify(jwtToken, uiPrivateKey));
}

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

module.exports = exports = {
                        getUiToken: getUiToken,
                        openJwt: openJwt,
                        getAccessToken: getAccessToken
                        };