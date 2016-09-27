"use strict";

const
    _ = require('lodash'),
     _eval = require('eval'),
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

    let runAssertions = function(driver, validate, validateResult, callback){
        console.error('============================================')
        console.error("Validate: "+ JSON.stringify(validate));
        console.error("Result: "+ JSON.stringify(validateResult));
        let ValidateResult = { text: '' };
        if(Array.isArray(validateResult.text) && (validateResult.text.length > 0) && (validateResult.text[0].body)){

            validateResult.text = validateResult.text[0];
        }

        if((validate.test.location) && (validate.test.location.indexOf('.') > -1)){
            let rval = _eval('module.exports = function () { return '+ JSON.stringify(validateResult.text)+'.'+validate.test.location+'} ');
            ValidateResult.text = rval();
        }else if(validate.test.location){
            ValidateResult.text = validateResult.text[validate.test.location];
        }else{
            ValidateResult.text = validateResult.text;
        }

        if(('caseSensitive' in validate.test) && (validate.test.caseSensitive == false)){
            if(!Array.isArray(validate.test.value))
                validate.test.value == validate.test.value.toLowerCase();
            if(!Array.isArray(ValidateResult.text))
                ValidateResult.text = ValidateResult.text.toLowerCase();
        }

        if('isEmpty' in validate.test){
            assert.isAbove(result.text.length, 0);
            callback();
        }

        if( availableAsserts.chaiTwo.indexOf(validate.test.action) !== -1){
                assert[validate.test.action](ValidateResult.text, validate.test.name || '');
                callback();
        }else if( availableAsserts.chaiThree.indexOf(validate.test.action) !== -1){
                assert[validate.test.action](ValidateResult.text, validate.test.value, validate.test.name || '');
                callback();
        }else if( availableAsserts.chaiThreeReverse.indexOf(validate.test.action) !== -1){
                 assert[validate.test.action]( validate.test.value, ValidateResult.text, validate.test.name || '');
                 callback();
         }else{
            //List of Extra lookups other then chai
            if(validate.test.action == 'operator'){
                if(!validate.test.operator){
                    console.error('With using operator Action you need to set validate.test.operator (<,>,=,!=)');
                    assert.equal(true, false, 'With using operator Action you need to set validate.test.operator (<,>,=,!=)');
                    callback(true);
                }else{
                    assert.operator(ValidateResult.text, validate.test.operator, validate.test.value, validate.test.name || '');
                    callback();
                }
            }else{
                console.error('The Validation defined in JSON is invalid referrer to "usage/validations" File')
                assert.equal(true, false, 'No Validation Action Defined ('+validate.test.action+')');
                callback(true);
            }
        }
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
                            runAssertions(driver, validate, result, function(end){
                                if(end)
                                    done();
                                else{
                                    if (runTest.validation[(validationIndex + 1)]) {
                                         runValidation((validationIndex + 1))
                                    } else {
                                         done();
                                                            }
                                }
                            });
                        });
                    } else {
                        done();
                    }

                    let rerunTest = function() {

                    }
                }

                //code to Run through the steps in testCase File
                let runSteps = function(stepindex) {
                    if(!runTest || (runTest.steps.length == 0)){
                       done();
                    }else{
                        //Sort Steps By ID
                        runTest.steps.sort(function(a, b) {
                          if (a.id > b.id)
                             return 1;
                          return a.id === b.id ? 0 : -1;
                        });
                        let step = runTest.steps[stepindex];
                        let path = './test/' + step.type + '/controller.js';
                        let stepController = require(path);
                        step.params.shared = sharedData;
                        step.params.shared.preSetup = preSetup;
                        adminFunctions.sharedDataCheck(step.params, function(options){
                            stepController.controller(driver, options, function(driver, sharedResult, error) {
                                function writeScreenshot(data, name) {
                                  name = name || 'default.png';
                                  fs.writeFileSync('screenshots/' + name, data, 'base64');
                                };

//                                driver.takeScreenshot().then(function(data) {
//                                  writeScreenshot(data, microservice+'_' + testCase+'ID_'+test.id+'Step_'+stepindex+'.png');
//                                });

                                if(error){
                                    console.error("Step: "+stepindex);
                                    console.error("Error Message: "+ JSON.stringify(error));
                                    console.trace("Stack Trace");
                                    assert.equal(true, false, 'Error on Step: '+ stepindex);
                                    done();
                                }
                                if(sharedResult)
                                    sharedData['step'+stepindex] = sharedResult;

                                //Check if Test is a validation also
                                if((step.tests) && (step.tests[0])){
                                    let runStepTest = function(driver, index){
                                        runAssertions(driver, { 'test': step.tests[index] }, sharedResult, function(end){
                                        //Run all validations in a loop
                                            if(end){
                                                done();
                                            }else if(step.tests[(index+1)]){
                                                runStepTest(driver, (index+1));
                                            }else{
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
                                            }
                                        });
                                    }
                                    runStepTest(driver, 0);
                                }else{
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
                                }
                            });
                        });
                    }
                }
                runSteps(0);
            });
        }
    });
}
module.exports = exports = { runTestFramework: runTestFramework }