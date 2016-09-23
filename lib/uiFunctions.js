'use strict';

require('dotenv').load();

const webdriver = require('selenium-webdriver'),
    log = require('./logger'),
    sleep = require('system-sleep'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    envVars = require('../framework/environments'),
    chrome = require('selenium-webdriver/chrome'),
    chromePath = require('chromedriver').path,
    _ = require('lodash');

var env = process.env.ENV || 'test',
    okta_name = 'I - Hub '+env.charAt(0).toUpperCase() + env.slice(1).toLowerCase(),
    headless = process.env.browserHeadless || true;

//login to UI with a configuration returning UI driver
function configLoadUi(config, callback){
 let driver;
 if(!config.driver){
     let service = new chrome.ServiceBuilder(chromePath).build();
     chrome.setDefaultService(service);
      if(headless == true){
          driver = new webdriver.Builder().forBrowser(config.browser).usingServer('http://127.0.0.1:19515/').build();
      }else{
          driver = new webdriver.Builder().forBrowser(config.browser).withCapabilities(webdriver.Capabilities.chrome()).build();
      }
      driver.get(envVars.url);
      driver.findElement(By.name('username')).sendKeys(config.username);
      driver.findElement(By.name('password')).sendKeys(config.password);
      driver.findElement(By.name('login')).click().then(function(){
        driver.getTitle().then(function(X){
            callback(driver)
            });
      });
 }else{
    driver = config.driver;
    driver.findElement(By.name('username')).sendKeys(config.username);
    driver.findElement(By.name('password')).sendKeys(config.password);
    driver.findElement(By.name('login')).click();
    driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "'+okta_name+'" )]/parent::li/a')), 50000).then(function(ele){
        ele.click();
    });
    var handlePromise = driver.getAllWindowHandles();
    handlePromise.then(function (handles){
        var popUpWindow = handles[handles.length-1];
        driver.switchTo().window(popUpWindow);
        callback(driver);
    });
 }

}

//Parse out Elements and applications to the UI
function uiAction(driver, options, callback){
    sleep(3000)
    if (options.elementTemplate) {
        options.xpath = options.xpath.replace('TEMPLATE',options.elementTemplate);
    }
    if (options.hoverXpath) {
        if (options.hoverElementTemplate) {
            options.hoverXpath = options.hoverXpath.replace('TEMPLATE',options.hoverElementTemplate);
        }
        driver.wait(until.elementLocated(By.xpath(options.hoverXpath.toString())), 2500000)
            .then(function(element) {
                let action = new webdriver.ActionSequence(driver);
                action.mouseMove(element).perform();
            }
        )
    }
    if(options.action == 'click'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 2500000).click().then(function(){
                callback(driver, {});
       });
   }else if(options.action == 'elementView'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 2500000).getInnerHtml().then(function(field){
                callback(driver, { 'text': field });
       });
   }else if(options.action == 'elementHtml'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 250000).getOuterHtml().then(function(element){
           callback(driver, { 'text': element });
       });
   }else if(options.action == 'elementGetAttribute'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 250000).getAttribute(options.attributeValue).then(function(element){
           callback(driver, { 'text': element });
       });
   }else if(options.action == 'sendkeys'){
       driver.wait(until.elementLocated(By.xpath(options.xpath.toString())), 2500000).then(function(ele){
        ele.sendKeys(options.elementValue).then(function(){
                callback(driver, {});
         });
       });
    }else if(options.action == 'arrayValue'){
        driver.wait(until.elementsLocated(By.xpath(options.xpath.toString())), 2500000).then(
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
    driver.get(envVars.url+options.location);
    driver.wait(until.elementLocated(By.xpath("//*[@id='dashboard-aggregates']/div[1]/header")), 30000).then(function(){
        callback(driver);
    });
}

module.exports = exports = {
           configLoadUi: configLoadUi,
           uiAction: uiAction,
           loadUrl: loadUrl
       };
