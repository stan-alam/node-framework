'use strict';

const
    wd = require("webdriver-sync"),
    By = wd.By,
    expect  = require("chai").expect,
    xpaths  = require ('./xpaths.js'),
    sleep = require('sleep'),
    sleepSeconds =8;

exports.oktaLogin = function(driver, params, cb) {
    describe('oktaLogin2', function() {

        it("driver exists", function(done){
            expect(driver).to.exist;
            done();
        });

        this.timeout(7000000)
        let xpath = xpaths.Okta_Single_SignOn.signInUserName;
        let keys = params[0].username;
        driver.findElement(By.xpath(xpath)).sendKeys(keys);

        xpath = xpaths.Okta_Single_SignOn.signInPassword;
        keys = params[0].password;
        driver.findElement(By.xpath(xpath)).sendKeys(keys);

        xpath = xpaths.Okta_Single_SignOn.signInButton;
        driver.findElement(By.xpath(xpath)).click();

        sleep.sleep(5);

        // it() validation for login?
        it("login complete", function(done){
            expect(true).to.equal(true);
            done(cb(driver));
        });

    });
}

exports.addApplications = function(driver, params, cb) {
    // only doing the first applciation, need to modify to save multiple applications
    var applicationName = params[0].name;

    describe('addApplications2 - ' + applicationName, function() {
        it("driver exists", function(done){
            expect(driver).to.exist;
            done();
        });

        this.timeout(7000000)
        sleep.sleep(sleepSeconds);
        let xpath = xpaths.CommonModal.inputRequiredLinkId;
        driver.findElement(By.xpath(xpath)).click();
        sleep.sleep(sleepSeconds);

        xpath = xpaths.CommonModal.inputForApp;
        driver.findElement(By.xpath(xpath)).sendKeys(applicationName);
        sleep.sleep(sleepSeconds);

        xpath = xpaths.CommonModal.saveButtonForApplicationAdd;
        driver.findElement(By.xpath(xpath)).click();
        sleep.sleep(sleepSeconds);

        // it() validation for add app?
        it("add application complete", function(done){
            expect(true).to.equal(true);
            done(cb(driver));
        });

    });

}

exports.deleteApplications = function(driver, params, cb) {
    //delete only one application, not multiple applications
    var applicationName = params[0].name;

    describe('deleteApplications - ' + applicationName, function(){
        it("driver exists", function(done) {
            expect(driver).to.exist;
            done();
        });

    this.timeout(7000000)
    sleep.sleep(sleepSeconds);

    let xpath =  xpaths.CommonModal.linksViewApplication;
    console.log(xpaths.CommonModal.linksViewApplication);
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);


    xpath =  xpaths.CommonModal.linksSelectApplication;
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

    xpath =  xpaths.CommonModal.buttonDeleteApplication;
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

    xpath = xpaths.CommonModal.buttonConfirmDeleteApplication;
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);


    });


}



exports.changeEnvironmentsProd = function(driver, params, cb) {
    //delete only one application, not multiple applications
    var applicationName = params[0].name;

    describe('changeEnvironmentsProd - ' + applicationName, function(){
        it("expect that environment displays Production", function(done) {
            expect(stringGrab).to.equal('Production');
            done();
        });

    this.timeout(7000000)
    sleep.sleep(sleepSeconds);

    let xpath =  xpaths.CommonModal.linksViewApplication;
    console.log(xpaths.CommonModal.linksViewApplication);
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

    xpath = xpaths.CommonModal.linksRequiredLinkHome;
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

    xpath = xpaths.CommonModal.linkSelectSettings;
    console.log(xpaths.CommonModal.linkSelectSettings);
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

   xpath = xpaths.CommonModal.linkSelectProd;
  // console.log(xpaths.CommonModal.linkSelectProd);
   driver.findElement(By.xpath(xpath)).click();
   sleep.sleep(sleepSeconds);


   xpath = xpaths.CommonModal.grabStringForEnvironment;
   var stringGrab = driver.findElement(By.xpath(xpath)).getText();
   sleep.sleep(sleepSeconds);
   console.log("should grab string value" + stringGrab);

    });

 }

exports.changeEnvironmentsTest = function(driver, params, cb) {

    var applicationName = params[0].name;

    describe('changeEnvironmentsTest - ' + applicationName, function(){
        it("expect the Environment to display Test", function(done) {
            expect(stringGrab2).to.equal('Test');
            done();
        });

    this.timeout(7000000)
    sleep.sleep(sleepSeconds);

    let xpath =  xpaths.CommonModal.linksViewApplication;
    console.log(xpaths.CommonModal.linksViewApplication);
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

    xpath = xpaths.CommonModal.linksRequiredLinkHome;
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

    xpath = xpaths.CommonModal.linkSelectSettings;
    console.log(xpaths.CommonModal.linkSelectSettings);
    driver.findElement(By.xpath(xpath)).click();
    sleep.sleep(sleepSeconds);

   xpath = xpaths.CommonModal.linkSelectTest;
   driver.findElement(By.xpath(xpath)).click();
   sleep.sleep(sleepSeconds);


   xpath = xpaths.CommonModal.grabStringForEnvironment;
   var stringGrab2 = driver.findElement(By.xpath(xpath)).getText();
   sleep.sleep(sleepSeconds);
   console.log("should grab string value" + stringGrab2);

    });

}





/* first try using selenium-webdriver
 these can be deleted


const
    expect  = require("chai").expect,
    until = require('selenium-webdriver').until,
    uiFunctions = require('../../../lib/uiFunctions.js'),
    driverLib = require('./driver.js'),
    xpaths  = require ('./xpaths.js'),
    sleep = require('sleep'),
    sleepSeconds =5;




exports.oktaLogin = function(driver, params, cb) {
    describe('oktaLogin', function() {

        let localDriver;
        let browserConfig = {browser : "chrome"};
        browserConfig.username = params[0].username;
        browserConfig.password = params[0].password;

         it("browser title is Ellucian Ethos Integration", function(done) {
            if (!driver) {
                this.timeout(1500000); //Web browser is slow so Increase the Timeout for mocha
                uiFunctions.loadUi(browserConfig,function(uiDriver){
                    localDriver = uiDriver; //Set Callback driver to local driver for interacting with Website
                    localDriver.getTitle().then(function(title){
                        expect(title).to.equal('Ellucian Ethos Integration');
                        done(cb(localDriver)); // pass driver back to caller
                    })
                });
            }
            else {
                localDriver = driver;
                done();
            }
         });
    });
}

exports.killBrowser = function(driver, params, cb) {
    describe('killBrowser', function() {
        it("browser was killed", function(done) {
            driver.quit()
                .then(function() { expect(true).to.equal(true); })
                .catch(function() { expect(false).to.equal(true);  })
                .finally(function() { done(cb(driver)); });
        });
    });


        {"name" : "kill browser step",
         "description":"Some description here about executing the step.",
         "function":"killBrowser",
         "params" : [  ]
        }

}

exports.addApplications = function(driver, params, cb) {
    var applicationName = params[0].name;

    describe('addApplications - ' + applicationName, function() {

        var clickedAddLink = false;

        before(function(done) {
            try {
                //this.timeout(50000);

                driver.wait(until.elementLocated(By.id('addApplication_link')), 50000)
                    .then(function(ele) { ele.click(); clickedAddLink = true; })
                    .catch(function(e) {  console.log('error finding link', e);  } )
                    .finally(function(){ done();});
            } catch(e) {
                console.log(e);
            }
        });

        it("Clicked add link", function(done) {
            expect(clickedAddLink).to.equal(true);
            done();
        });

        it("Add appplication name", function(done) {
            driver.wait(until.elementLocated(By.id('input_name')), 50000)
                    .then(function(ele) { ele.sendKeys(applicationName);  expect(true).to.equal(true); })
                    .catch(function(e) {  console.log('error finding input txtbox', e); } )
                    .finally(function(){ done();});
        });

        it("Press save button", function(done) {
            driver.wait(until.elementLocated(By.id('wizard_save_button')), 50000)
                    .then(function(ele) { ele.click();  expect(true).to.equal(true); })
                    .catch(function(e) {  console.log('error save button', e); } )
                    .finally(function(){ done();});
        });

        it("Verify page title", function(done) {
            driver.wait(until.elementLocated(By.xpath('//*[@id="bread-crumbs-title"]/cp-view-title')), 50000)
                    .then(function(ele) { ele.getInnerHtml()
                        .then(function(text) { expect(text).to.equal(applicationName); })
                        .catch(function(e) { console.log('error inner html', e); } );
                    })
                    .catch(function(e) {  console.log('error page title', e); } )
                    .finally(function(){ done();});
        });

        it("Click home link", function(done) {
            driver.wait(until.elementLocated(By.xpath("//a[@data-ng-click='goHome()']")), 50000)
                    .then(function(ele) { ele.click();  expect(true).to.equal(true); })
                    .catch(function(e) {  console.log('error home link', e); } )
                    .finally(function(){ done();});
        });


        it("driver exists", function(done) {
            expect(driver).to.exist;
            done(cb(driver));
        });

  });



}


*/
