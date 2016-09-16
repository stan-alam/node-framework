'use strict';

require('dotenv').load();

const webdriver = require('selenium-webdriver'),
    log = require('./logger'),
    sleep = require('system-sleep'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    envVars = require('../framework/environments'),
    _ = require('lodash');

var env = process.env.ENV || 'test',
    username = process.env.Username || 'aakoepke@ellucian.me.sandbox',
    password = process.env.Password || 'Demo99!?',
    okta_name = 'I - Hub '+env.charAt(0).toUpperCase() + env.slice(1).toLowerCase(),
    defaultBrowser = process.env.browser || 'chromedriver',
    headless = process.env.browserHeadless || false;


//login to UI with a configuration returning UI driver
function configLoadUi(config, callback){
 let driver;
  if(headless){
      driver = new webdriver.Builder().forBrowser(config.browser).usingServer('http://127.0.0.1:9515/').build();
  }else{
      driver = new webdriver.Builder().forBrowser(config.browser).build();
  }
  driver.get(envVars.test.url);
  driver.findElement(By.name('username')).sendKeys(config.username);
  driver.findElement(By.name('password')).sendKeys(config.password);
  driver.findElement(By.name('login')).click().then(function(){
    driver.getTitle().then(function(X){
        callback(driver)
        });
  });
}

//Login to UI without configuration information and using env or default values
function loadUi(callback){
 let driver;
  if(headless){
      driver = new webdriver.Builder().forBrowser(defaultBrowser).usingServer('http://127.0.0.1:9515/').build();
  }else{
      driver = new webdriver.Builder().forBrowser(defaultBrowser).build();
  }
  driver.get(envVars.test.url);
  driver.findElement(By.name('username')).sendKeys(username);
  driver.findElement(By.name('password')).sendKeys(password);
  driver.findElement(By.name('login')).click().then(function(){
    callback(driver)
  });
}

//Parse out Elements and applications to the UI
function uiAction(driver, options, callback){
    sleep(2000)
    if (options.elementTemplate) {
           options.xpath = options.xpath.replace('TEMPLATE',options.elementTemplate);
       }
       if (options.hoverXpath) {
           if (options.hoverElementTemplate) {
               options.hoverXpath = options.hoverXpath.replace('TEMPLATE',options.hoverElementTemplate);
           }
           driver.wait(until.elementLocated(By.xpath(options.hoverXpath.toString())),250000)
               .then(function(element) {
                   let action = new webdriver.ActionSequence(driver);
                   action.mouseMove(element).perform();
               }
           )
       }
       console.error(options)
    if(options.action == 'click'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 250000).click().then(function(){
                callback(driver, {});
       });
   }else if(options.action == 'elementView'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 250000).getInnerHtml().then(function(field){
                callback(driver, { 'text': field });
       });
   }else if(options.action == 'sendkeys'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 250000).then(function(ele){
        ele.sendKeys(options.elementValue).then(function(){
                callback(driver, {});
         });
       });
    }else if(options.action == 'arrayValue'){
        driver.wait(until.elementsLocated(By.xpath(options.xpath.toString())), 250000).then(
            function(elements){
                let values = [];
                _.each(elements, function(element) {
                    element.getText().then(
                        function(text) {
                            values.push(text);
                            if (values.length === elements.length) {
                                callback(driver,{'text': values});
                            }
                        }
                    );
                });
            });
    }else{
        console.log("Error: No UI Action defined for: "+ options.action)
    }
}

//load a specified path
function loadUrl(driver, options, callback){
    driver.get(envVars.test.url+options.location);
    driver.wait(until.elementLocated(By.xpath("//*[@id='dashboard-aggregates']/div[1]/header")), 30000).then(function(){
        callback(driver);
    });
}

module.exports = exports = {
           loadUi: loadUi,
           configLoadUi: configLoadUi,
           uiAction: uiAction,
           loadUrl: loadUrl
       };
