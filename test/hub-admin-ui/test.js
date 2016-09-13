"use strict";

const
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    assert = require("chai").assert,
    envVars = require('../../framework/environments'),
    uiFunctions = require('../../lib/uiFunctions.js');

describe('Starting Hub-Admin-Ui End to End', function() {
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

    //Loop throught all the TestCases for Hub-admin-ui
    //let testCasesFun = function(caseIndex){
    let testCasefiles = fs.readdirSync('./testStories/hub-admin-ui/');
    //    caseIndex++;
    async.each(testCasefiles, function(testCase){
        let test = require('../../testStories/hub-admin-ui/' + testCase);
        var i = 0;

        for (var testCaseLoop of test.testCases) {
            it('(EIH-'+test.id+') - Test Case: ' + testCaseLoop.name, function(done) {
                this.timeout(80000000);
                let runTest = test.testCases[i++]; //Will need to loop through

                //Run any Validation steps that are in testcase
                let runValidation = function(validationIndex) {
                    if (runTest.validation[validationIndex]) {
                        let validat = runTest.validation[validationIndex];
                        let path = '../' + validat.type + '/library.js';
                        let stepLibrary = require(path);
                        stepLibrary.controller(driver, validat, function(driver, result) {
                            if (validat.test.action == 'contains') {
                                assert.include(result.text, validat.test.value);
                                rerunTest();
                            }else if(validat.test.action == 'equal'){
                                if((validat.test.operator) && (validat.test.operator == 'or')){
                                    assert.oneOf(result.text.toLowerCase(), validat.test.value);
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
                        //testCasesFun(caseIndex);
                        return true;
                    }
                    let step = runTest.steps[stepindex];

                    let path = '../' + step.type + '/library.js';
                    let stepLibrary = require(path);
                    stepLibrary.controller(driver, step.params, function(driver) {
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
                }

                runSteps(0);
            });
        }
    })
    //testCasesFun(0)
});