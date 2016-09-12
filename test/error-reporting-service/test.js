'use strict';

const authFunctions = require('../../lib/authFunctions.js'),
    configFunctions = require('../../lib/configFunctions.js'),
    uiFunctions = require('../../lib/uiFunctions.js'),
    randomstring = require("randomstring"),
    envVars = require('../../framework/environments'),
    request = require('sync-request'),
    sleep = require('sleep'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

global.assert = require('assert');

describe("Running Error Integration Tests", function() {
  let driver, uiToken, accessToken = '';
  let applicationList = [];
  let errorSchema = require('./schema/errors');
  let validateDescription = randomstring.generate(30);

  before(function(done){
    this.timeout(1500000);
    uiFunctions.loadUi(function(uiDriver){
        driver = uiDriver;
        authFunctions.getUiToken(driver, function(Token){
            uiToken = Token;
            configFunctions.createApplications(2, uiToken, [], function(error, applications){
                if(error){
                    console.error("Error: "+error);
                    process.exit();
                }else{
                    applicationList = applications;
                    authFunctions.getAccessToken(applicationList[0].apiKey, function(error, returnAccessToken){
                        if(error){
                            console.error('Error: '+error);
                            process.exit();
                        }else{
                            accessToken = returnAccessToken;
                            done();
                        }
                    });
                }
            });
        });
    });
  });

  after(function(done){
    configFunctions.deleteApplications(applicationList.id, uiToken);
    driver.quit();
    done();
  });

  it("Invoke errors api with valid errors payload", function(done) {
    this.timeout(1500000)
    errorSchema.applicationId = applicationList.id;
    errorSchema.description = validateDescription;
    let url = envVars.test.url+envVars.global.error;
    let res = request('POST', url, {
        'headers': {
            "content-type": envVars.headers.error,
            "Authorization": "Bearer "+ accessToken
        },
        'body': JSON.stringify(errorSchema)
    });
    assert.equal(res.statusCode, 201);
    done();
  });

  it("Invoke errors api with invalid errors payload", function(done) {
    this.timeout(1500000)
    delete errorSchema.responseCode;
    errorSchema.description = 'Random String';
    let url = envVars.test.url+envVars.global.error;
    sleep.sleep(1);
    let res = request('POST', url, {
        'headers': {
            "content-type": envVars.headers.error,
            "Authorization": "Bearer "+ accessToken
        },
        'body': JSON.stringify(errorSchema)
    });
    assert.equal(res.statusCode, 400);
    done();
  });

  it("Verify UI has Error Message Sent", function(done) {
    this.timeout(1500000);
    driver.wait(until.elementLocated(By.xpath("//*[@id='errorsCount_link']")), 100).click().then(function(){
        driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'filter')]")), 13000).click().then(function(){
            driver.wait(until.elementLocated(By.xpath("//*[@id='input_description']")), 2500).then(function(ele){
                sleep.sleep(5)
                ele.sendKeys(validateDescription);
                driver.wait(until.elementLocated(By.xpath('//*[@name="filter"]')), 100).click().then(function(){
                    sleep.sleep(1) // Need to slp for a second to wait for filter
                    driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[2]/section/section/div/div/ng-include/div[2]/table/tbody/tr[2]/td[5]/span[2]')), 100).getInnerHtml().then(function(field){
                        assert.equal(field, validateDescription);
                        done();
                    });
                });
            });
        });
     });
  });
});
