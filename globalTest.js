"use strict";

const
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    assert = require("chai").assert,
    envVars = require('./framework/environments'),
    availableAsserts = require('./framework/validation'),
    uiFunctions = require('./lib/uiFunctions.js'),
    preSetupLib = require('./lib/presetup.js'),
    adminFunctions = require('./lib/adminFunctions.js');

let runTestFramework = function(microservice){
    var driver;
    var uiToken;
    var preSetup;

    before(function(done) {
        this.timeout(500000000)
        let uiConfig = {
            'username': envVars.credentials.username,
            'password': envVars.credentials.password,
            'browser': 'chrome'
        };

        uiFunctions.configLoadUi(uiConfig, function(uiDriver) {
            driver = uiDriver;
              preSetupLib.setup(driver, function(driver, setup){
                  preSetup = setup;
                done();
             });
        });
    });

    after(function(done){
        this.timeout(800000000);
        preSetupLib.cleanUp(driver, preSetup, function(){
        driver.quit();
            done();
        });
    });

    //Loop thought all the TestCases for Hub-admin-ui
    let testCasefiles = fs.readdirSync('./testStories/'+microservice+'/');
    if(testCasefiles.indexOf('develop.json') !== -1){
        testCasefiles = ['develop.json'];
    }

    let testCase = '';
    async.each(testCasefiles, function(testCase){
        let test = require('./testStories/'+microservice+'/' + testCase);
        var i = 0;

        var sharedData = {};
        for (var testCaseLoop of test.testCases) {
            it('(EIH-'+test.id+') - Test Case: ' + testCaseLoop.name, function(done) {
                this.timeout(80000000);
                let runTest = test.testCases[i++]; //Will need to loop through
                //Run any Validation steps that are in testcase
                let runValidation = function(validationIndex) {
                    console.log("running validation"+validationIndex);
                    if (runTest.validation[validationIndex]) {
                        let validate = runTest.validation[validationIndex];
                        let path = './test/' + validate.type + '/controller.js';
                        let stepController = require(path);
                        stepController.controller(driver, validate, function(driver, result) {
                            if(('caseSensitive' in validate.test) && (validate.test.caseSensitive == false)){
                                if(!Array.isArray(validate.test.value))
                                    validate.test.value == validate.test.value.toLowerCase();
                                if(!Array.isArray(result.text))
                                    result.text = result.text.toLowerCase();
                            }
                            if( availableAsserts.chaiTwo.indexOf(validate.test.action) !== -1){
                                    assert[validate.test.action](result.text, validate.test.name || '');
                                    rerunTest();
                            }else if( availableAsserts.chaiThree.indexOf(validate.test.action) !== -1){
                                    assert[validate.test.action](result.text, validate.test.value, validate.test.name || '');
                                    rerunTest();
                            }else if( availableAsserts.chaiThreeReverse.indexOf(validate.test.action) !== -1){
                                     assert[validate.test.action]( validate.test.value, result.text, validate.test.name || '');
                                     rerunTest();
                             }else{
                                //List of Extra lookups other then chai
                                if(validate.test.action == 'operator'){
                                    if(!validate.test.operator){
                                        console.error('With using operator Action you need to set validate.test.operator (<,>,=,!=)');
                                        assert.equal(true, false, 'With using operator Action you need to set validate.test.operator (<,>,=,!=)');
                                        done();
                                    }else{
                                        assert.operator(result.text, validate.test.operator, validate.test.value, validate.test.name || '');
                                        rerunTest();
                                    }
                                }else{
                                    console.error('The Validation defined in JSON is invalid referrer to "usage/validations" File')
                                    assert.equal(true, false, 'No Validation Action Defined ('+validate.test.action+')');
                                    done();
                                }
                            }
                        });
                    } else {
                        done();
                    }

                    let rerunTest = function() {
                        if (runTest.validation[(validationIndex + 1)]) {
                            runValidation((validationIndex + 1))
                        } else {
                            done();
                        }
                    }
                }

                //code to Run through the steps in testCase File
                let runSteps = function(stepindex) {
                    if(runTest.steps.length == 0){
                        return true;
                    }
                    let step = runTest.steps[stepindex];
                    let path = './test/' + step.type + '/controller.js';
                    let stepController = require(path);
                    step.params.shared = sharedData;
                    step.params.shared.preSetup = preSetup;
                    adminFunctions.sharedDataCheck(step.params, function(options){
                        console.log("options="+JSON.stringify(options));
                        stepController.controller(driver, options, function(driver, sharedResult, error) {
                            if(error){
                                console.error("Step: "+stepindex);
                                console.error("Error Message: "+ JSON.stringify(error));
                                console.trace("Stack Trace");
                                assert.equal(true, false, 'Error on Step: '+ stepindex);
                                done();
                            }
                            if(sharedResult)
                                sharedData['step'+stepindex] = sharedResult;

                            if (runTest.steps[stepindex + 1]) {
                                runSteps((stepindex + 1));
                            } else {
                                if (runTest.validation) {
                                    runValidation(0);
                                } else {
                                    i = i + 1;
                                    done();
                                }
                            }
                        });
                    });
                }
                runSteps(0);
            });
        }
    });
}
module.exports = exports = { runTestFramework: runTestFramework }
