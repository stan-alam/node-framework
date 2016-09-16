"use strict";

const
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    assert = require("chai").assert,
    envVars = require('./framework/environments'),
    uiFunctions = require('./lib/uiFunctions.js'),
    adminFunctions = require('./lib/adminFunctions.js');

let runTestFramework = function(microservice){
    var driver;
    var uiToken;

    before(function(done) {
        this.timeout(500000000)
        let uiConfig = {
            'username': envVars.uiTesting.username,
            'password': envVars.uiTesting.password,
            'browser': 'chrome'
        };

        uiFunctions.configLoadUi(uiConfig, function(uiDriver) {
            driver = uiDriver;
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
                    if (runTest.validation[validationIndex]) {
                        let validate = runTest.validation[validationIndex];
                        let path = './test/' + validate.type + '/controller.js';
                        let stepController = require(path);
                        stepController.controller(driver, validate, function(driver, result) {
                            if (validate.test.action == 'contains') {
                                assert.include(result.text, validate.test.value);
                                rerunTest();
                            }else if(validate.test.action == 'equal'){
                                if((validate.test.operator) && (validate.test.operator == 'or')){
                                    assert.oneOf(result.text.toLowerCase(), validate.test.value);
                                    rerunTest();
                                } else if ((validate.test.operator) && (validate.test.operator == 'includeMembers')){
                                    assert.includeMembers(result.text,validate.test.value,'Should be subset failure');
                                    rerunTest();
                                } else {
                                    assert.equal(result.text,validate.test.value);
                                    rerunTest();
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
                    adminFunctions.sharedDataCheck(step.params, function(options){
                        stepController.controller(driver, options, function(driver, sharedResult) {
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
