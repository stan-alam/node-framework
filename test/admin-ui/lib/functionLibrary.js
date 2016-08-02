'use strict';

const
    expect  = require("chai").expect,
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    uiFunctions = require('../../../lib/uiFunctions.js');

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

    /*
        {"name" : "kill browser step",
         "description":"Some description here about executing the step.",
         "function":"killBrowser",
         "params" : [  ]
        }
*/
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
