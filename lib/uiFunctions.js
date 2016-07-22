'use strict';

const webdriver = require('selenium-webdriver'),
    log = require('./logger'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var env = process.env.ENV || 'test',
    username = process.env.Username || 'aakoepke@ellucian.me.sandbox',
    password = process.env.Password || 'Demo99!?',
    okta_name = 'I - Hub '+env.charAt(0).toUpperCase() + env.slice(1).toLowerCase(),
    headless = process.env.browserHeadless || false;

function loadUi(config, callback){
 let driver;
  if(headless){
      driver = new webdriver.Builder().forBrowser(config.browser).usingServer('http://127.0.0.1:9515/').build();
  }else{
      driver = new webdriver.Builder().forBrowser(config.browser).build();
  }
  driver.get('https://elluciantest.okta.com/'); //Login Url
  driver.findElement(By.name('username')).sendKeys(config.username);
  driver.findElement(By.name('password')).sendKeys(config.password);
  driver.findElement(By.name('login')).click();

  driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "'+okta_name+'" )]/parent::li/a')), 50000).then(function(ele){
      ele.click();
    }).catch(function(e){
    driver.takeScreenshot().then(
            function(image, err) {
                require('fs').writeFile('mochawesome-reports/errorScreenshot.png', image, 'base64');
            }
        );
    });
    var handlePromise = driver.getAllWindowHandles();
    handlePromise.then(function (handles){
      var popUpWindow = handles[1];
      driver.switchTo().window(popUpWindow);
  callback(driver);
    }).catch(function(e){
         driver.takeScreenshot().then(
                 function(image, err) {
                     require('fs').writeFile('mochawesome-reports/errorScreenshot.png', image, 'base64');
                 }
             );
         });
}

module.exports = exports = {
                       loadUi: loadUi
                        };